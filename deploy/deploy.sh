# Grant the Service Account the Invoker Role
gcloud run services add-iam-policy-binding api \
  --member "serviceAccount:ui-invoker@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role "roles/run.invoker" \
  --region ${REGION}

# Without cloudbuild.yaml - in ui dir:
docker build -t northamerica-northeast1-docker.pkg.dev/phx-01hwmw2c1r4/dashboard/ui .
docker push northamerica-northeast1-docker.pkg.dev/phx-01hwmw2c1r4/dashboard/ui
gcloud run deploy ui \
  --image northamerica-northeast1-docker.pkg.dev/phx-01hwmw2c1r4/dashboard/ui \
  --region northamerica-northeast1 \
  --platform managed \
  --allow-unauthenticated 

gcloud run services add-iam-policy-binding api \
  --member="serviceAccount:ui-invoker@phx-01hwmw2c1r4.iam.gserviceaccount.com" \
  --role="roles/run.invoker" \
  --region northamerica-northeast1


curl -X OPTIONS \
  -H "Origin: https://ui-744920990938.northamerica-northeast1.run.app" \
  -H "Access-Control-Request-Method: GET" \
  "https://api-oduxqcmvlq-nn.a.run.app/SBOM" -i

curl -X OPTIONS \
  -H "Origin: https://ui-744920990938.northamerica-northeast1.run.app" \
  -H "Access-Control-Request-Method: GET" \
  "https://api-744920990938.northamerica-northeast1.run.app/SBOM" -i

gcloud auth print-identity-token
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://api-744920990938.northamerica-northeast1.run.app/

gcloud auth print-identity-token
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://api-oduxqcmvlq-nn.a.run.app

  gcloud run services describe api --region northamerica-northeast1 

  curl "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=https://api-oduxqcmvlq-nn.a.run.app/proxy/sbom" \
     -H "Metadata-Flavor: Google"


curl -X GET https://api-oduxqcmvlq-nn.a.run.app/proxy/sbom