# cATO (or health) Dashboard for Safe Inputs

Only a few metrics at the moment. More to come. This may be integrated with observatory in the future (just using to learn react at the moment).

## To Run 

npm run dev

<!-- 
TOKEN=$(gcloud auth print-access-token)
curl -H "Authorization: Bearer $TOKEN" https://3001-cs-281831690367-default.cs-us-east1-yeah.cloudshell.dev/vulnerabilities -->

## Set up IAP 

* https://www.youtube.com/watch?v=ayTGOuCaxuc
* https://cloud.google.com/iap/docs/enabling-cloud-run#console
* https://cloud.google.com/iap/docs/managing-access#turning_on_and_off

## Discover private API url 
gcloud run services describe api --region northamerica-northeast1

gcloud auth print-identity-token
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" https://<LOAD_BALANCER_URL>/api
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)"


curl https://api-744920990938.northamerica-northeast1.run.app/vulnerabilities


http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=<API_URL>


IAP:
https://cloud.google.com/iap/docs/enabling-cloud-run

create service account service-744920990938@gcp-sa-iap.iam.gserviceaccount.com with cloud run invoker role 

Troubleshoot cerfitivates: 
create certificate: https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs
https://cloud.google.com/load-balancing/docs/ssl-certificates/troubleshooting

This one walks through creating load balancer and certificate.
https://www.youtube.com/watch?v=LGobxFyu3zw

SErvice to servie authentication
https://cloud.google.com/run/docs/authenticating/service-to-service 
(add cloud run invoker to compute developer)

