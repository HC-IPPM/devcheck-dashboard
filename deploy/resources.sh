# https://docs.keeper.io/en/sso-connect-cloud/device-approvals/automator/google-cloud-with-gcp-cloud-run

 gcloud config set project phx-01hwmw2c1r4

# create managed certificate
 gcloud compute ssl-certificates create dashboard-google-certificate \
    --domains safeinputs-dashboard.alpha.phac-aspc.gc.ca \
    --global

# Create serverless network endpoint group (neg)
gcloud compute network-endpoint-groups create ui-neg \
    --region northamerica-northeast1 \
    --network-endpoint-type=serverless \
    --cloud-run-service ui

# Create backend service that will use the NEG
gcloud compute backend-services create ui-backend \
    --global \
    --protocol HTTP

# Attache NEG to the backend service
gcloud compute backend-services add-backend keeper-automator-backend \
    --global \
    --network-endpoint-group ui-neg \
    --network-endpoint-group-region northamerica-northeast1

# Create a URL map that directs incoming traffic to the backend service
gcloud compute url-maps create keeper-automator-url-map \
    --default-service keeper-automator-backend

# Create the HTTPS target proxy and map the Automator certificate
gcloud compute target-https-proxies create keeper-automator-target-proxy \
    --url-map keeper-automator-url-map \
    --ssl-certificates automator-compute-certificate

# Reserve a static IP address and assign DNS entry
gcloud compute addresses create keeper-automator-ip --global
# (copu IP address for later) - set up A record pointing to IP addrees TT:
gcloud compute addresses list

# Create a Global forwarding rule
gcloud compute forwarding-rules create keeper-automator-forwarding-rule \
    --global \
    --target-https-proxy keeper-automator-target-proxy \
    --ports 443 \
    --address keeper-automator-ip

# Open up IP addresses Cloud armor

# Attach the Cloud Armor security policy to the backend service
gcloud compute backend-services update keeper-automator-backend \
    --global \
    --security-policy allow-specific-ips-policy