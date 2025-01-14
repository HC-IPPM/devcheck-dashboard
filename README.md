# cATO Dashboard

More of a learning React project, but also we need a dashboard to display some outputs from the Safe Inputs continuous integration, so this is a 2-for-1. This is a first-pass, get-it-up-and-running work-in-progress and understand it's in need of a big refactor.

Basing this on Pelias [Canada](https://github.com/PHACDataHub/pelias-canada) as a lot of work has been done, and is being done around accessibility for this. Similarly, using vite over RSpack as this is a smaller project, and vite has a larger community from a learning aspect. 

This is a standalone project, rather than combining with [Observatory](https://observatory.alpha.phac.gc.ca/safeinputs-alpha-phac-aspc-gc-ca) at the moment as we can more easily lock this down in the MVP with IAP and the data model is different. It may make sense to integrate this into Observatory once flushed out as it contains metrics such as uptime, cloud costs and GitHub configurations which are useful here and will revisit once we have an idea of what is needed out of this and have evaluated the risk of having access to all vunerabilities in one application and have modified the open by default intention of Observatory. 

## To Run
1. Populate the service account key file *sa-key.json*.
2. Populate the .env files 
```
cd ui
npm run dev
```
Authenticate with google cloud platform. 
```
cd ../api
npm run dev
```
Authenticate with google cloud platform. 


