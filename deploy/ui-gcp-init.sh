# Mostly steps from google run tutorial from: https://cloud.google.com/sql/docs/postgres/connect-run
# https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build

# NOTE - this needs a cloudbuild.yaml in the root of the UI directory
# NOTE - DO NOT follow GCP directions to set up cloudbuild (there is already a github app - if you recreate it, then all projects will be disconnected)

# ----- SET UP ENVIRONMENT VARIABLES -----
# # # If using terminal and running commands individually - use this:

export GOOGLE_CLOUD_PROJECT=phx-01hwmw2c1r4
export PROJECT_ID=phx-01hwmw2c1r4
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
export REGION=northamerica-northeast1
export SERVICE_NAME=ui
export SECRET_SETTINGS_NAME=dashboard-secret-settings
export ARTIFACT_REGISTRY_REPO=dashboard
export CLOUD_BUILD_TRIGGER_NAME=ui-trigger
export GITHUB_REPO_NAME=dashboard
export CLOUD_BUILD_CONFIG_PATH=cloudbuild.yaml
export GITHUB_REPO_OWNER=HC-IPPM
# export DB_PASSWORD=$(openssl rand -base64 16 | tr -dc A-Za-z0-9 | head -c16 ; echo '')



# # If using as a script:
# PROJECT_ID=$(gcloud config get-value project) 
# PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
# REGION=northamerica-northeast1
# #Artifact Registry
# ARTIFACT_REGISTRY_REPO=react-app

# #Cloud Build
# CLOUD_BUILD_TRIGGER_NAME=react-trigger
# GITHUB_REPO_NAME=open-data
# CLOUD_BUILD_CONFIG_PATH=ui/cloudbuild.yaml
# GITHUB_REPO_OWNER=PHACDataHub
# #Cloud Run 
# SERVICE_NAME=open-data 
# SECRET_SETTINGS_NAME=open-data-secret-settings



# ----- ARTIFACT REGISTRY -----
# Enable Artifact Registry to store container images for Cloud Run to use 
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Repo within the Artifact Registry
gcloud artifacts repositories create $ARTIFACT_REGISTRY_REPO \
   --location=$REGION \
   --description=$ARTIFACT_REGISTRY_REPO \
   --repository-format=docker 

# Authorize docker to push images to artifact registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev



# ----- CLOUD BUILD ----
# Set up Cloud Build  (https://cloud.google.com/sdk/gcloud/reference/beta/builds/triggers/create/github)
# On push to main branch in specified GitHub repo, Cloud Build is triggered to run the steps outlined in cloudbuild.yaml: 
# building and pushing Docker image to Artifact Registry, running migration, and populating static files, then deploy to Cloud Run with connection to Cloud SQL

# Enable Cloud Build service and source repo
gcloud services enable \
  cloudbuild.googleapis.com \
  sourcerepo.googleapis.com \
  cloudresourcemanager.googleapis.com 


# From cpho - not sure if needed as it worked before this push...

#     gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
#       --member "serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
#       --role "roles/cloudbuild.serviceAgent"

#     gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
#       --member "serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
#       --role "roles/artifactregistry.writer"

#           gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
#       --member "serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
#       --role "roles/artifactregistry.writer"

# ** Need to add cloudbuild.yaml to repo and the in Google Cloud console, connect Cloud Build to GitHub Repository 

# Add cloud build trigger (this is set to be triggered on push to main branch)
gcloud builds triggers create github \
  --name=${CLOUD_BUILD_TRIGGER_NAME} \
  --region ${REGION} \
  --repo-name=${GITHUB_REPO_NAME} \
  --repo-owner=${GITHUB_REPO_OWNER} \
  --branch-pattern="^main$" \
  --build-config=${CLOUD_BUILD_CONFIG_PATH} \
  --include-logs-with-status \
  --no-require-approval

# When this fails the first time, go connect repo to project in console

# To run without GitHub trigger: gcloud builds submit --config cloudbuild.yaml

# Bind permissions to Cloud Build service account:
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/cloudbuild.serviceAgent \
    --role=roles/run.admin \
    --role=roles/artifactregistry.writer \
    --role=roles/secretmanager.secretAccessor \
    --role=roles/iam.serviceAccountUser



# ----- CLOUD RUN -----
# Enable Cloud Run API    
gcloud services enable run.googleapis.com
gcloud services enable compute.googleapis.com

# Grant the IAM Service Account User role to the Cloud Build service account for the Cloud Run runtime service account
gcloud iam service-accounts add-iam-policy-binding \
    $PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/iam.serviceAccountUser

gcloud projects add-iam-policy-binding $PROJECT_ID\
    --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --role=roles/run.admin



#Create service
gcloud run deploy $SERVICE_NAME \
--image "${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${SERVICE_NAME}" \
--platform managed \
--region $REGION \
--allow-unauthenticated 


# ---- SECRET MANAGER -----
# Enable API
gcloud services enable secretmanager.googleapis.com

# # create secrets (Open Data secret settings)
# echo DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@//cloudsql/${PROJECT_ID}:${REGION}:${INSTANCE_NAME}/${DB_NAME} > .env
# echo GS_BUCKET_NAME=${PROJECT_ID}_MEDIA_BUCKET >> .env
# echo SECRET_KEY=$(cat /dev/urandom | LC_ALL=C tr -dc '[:alpha:]'| fold -w 50 | head -n1) >> .env

# # store secrets
# gcloud secrets create --locations ${REGION} --replication-policy user-managed ${SECRET_SETTINGS_NAME} --data-file .env

# Enable Cloud Run & cloud build to be able to access this 'open data secret settings' secret
gcloud secrets add-iam-policy-binding ${SECRET_SETTINGS_NAME} \
    --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor 

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com \
  --role=roles/iam.serviceAccountUser

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin


# # # OR if secret already exists, and just need to UPDATE
# gcloud secrets versions add ${SECRET_SETTINGS_NAME} \
#     --data-file=.env \
#     --project=${PROJECT_ID}

# # To verify that this worked
# gcloud secrets describe ${SECRET_SETTINGS_NAME}
# (or gcloud secrets list)

# gcloud secrets versions access latest --secret ${SECRET_SETTINGS_NAME}  #django_settings


# in another terminal set environment variables
export GOOGLE_CLOUD_PROJECT=phx-01h9nwnj4p




# # deploy cloud build, run database migrations and populate static assests
# gcloud builds submit --config cloudbuild.yaml \
#     --substitutions _INSTANCE_NAME=test-instance, _REGION=northamerica-northeast1



# save service url as environment variable

# SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed \
#     --region northamerica-northeast1 --format "value(status.url)")


# gcloud run services update $SERVICE_NAME \
#     --platform managed \
#     --region northamerica-northeast1 \
#     --set-env-vars CLOUDRUN_SERVICE_URL=$SERVICE_URL

# # sign in to /admin :get password: 
#  gcloud secrets versions access latest --secret superuser_password && echo ""

# # to run - add deploy step to yaml and 
# gcloud builds submit --config cloudbuild.yaml or add trigger
# ```


# Give UI permission to invoke API cloud run service: 
gcloud run services add-iam-policy-binding api \
    --member="serviceAccount:service-${PROJECT_NUMBER}@serverless-robot-prod.iam.gserviceaccount.com" \
    --role="roles/run.invoker" \
    --region=${REGION}

gcloud run services add-iam-policy-binding ui \
    --member="serviceAccount:service-${PROJECT_NUMBER}@serverless-robot-prod.iam.gserviceaccount.com" \
    --role="roles/run.invoker" \
    --region=${REGION}


# -----------------------------------------that didn't work try below:
# Assign service account to ui
gcloud iam service-accounts create ui-invoker \
  --description "Service account for UI to call API" \
  --display-name "UI Invoker"


# Update the UI service to use this service account
gcloud run services update ui \
  --service-account ui-invoker@${PROJECT_ID}.iam.gserviceaccount.com \
  --region ${REGION}

# Grant Invoker Permission to the API
# Grant the roles/run.invoker role to the ui-invoker service account for the API service:
gcloud run services add-iam-policy-binding api \
  --member "serviceAccount:ui-invoker@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role "roles/run.invoker" \
  --region ${REGION}

# Get API Private URL 
gcloud run services describe api \
  --region northamerica-northeast1 \
  --format="value(status.url)"

https://api-oduxqcmvlq-nn.a.run.app

  gcloud run services describe api \
  --region YOUR_REGION \
  --format="value(status.url)"


# get ui service account
gcloud run services describe ui \
  --region $REGION 
