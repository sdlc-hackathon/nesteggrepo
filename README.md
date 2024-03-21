# Sample Three tier app for SDLC Hackathon

This repository consists of a simple three tier application that is designed to be containerised and deployed to OpenShift. It's pupose is to give users a basic app which can then be used for exploring the software development lifecycle and ways in which it can be improved. 

The app comprises a MariaDB backend database engine, Nodejs api layer and a React front end. The code for each tier of the application, along with Dockerfiles for building the images can be found in individual directories of the repository.

## Deploying the application manually to an Openshift cluster

### Prerequisites
- An openshift cluster with appropriate permissions to create deployments
- A container registry for storing images (instructions assume usage of the internal OCP registry)
- A desktop machine (preferably Linux) with podman installed for building and pushing images and git for cloning repositories

### Deploying the database layer

The database layer consists of a instance of MariaDB, a MySQL compatible relational database engine, running in a single pod. Note, the method of deployment used here is not suitable for production.

1. Set up some environment variables to aid with deployment. 
```shell
export DB_USER=apiuser DB_PASS=apiuserP#ssword DB_NAME=faqs DB_HOST=faqdb
```
2. In your terminal window, log into your Openshift cluster. To obtain the login command for your cluster, navigate to the cluster console in your browser, in the top right corner click your username, and then click *Copy login command* followed by *Display Token*.
3. In your terminal window, change to the Openshift project for your Hackathon team by using the following command but replacing <YOUR TEAM NAME> with the name of your team.
```shell
oc project <YOUR TEAM NAME>
```
4. Get the internal imgae registry URL and store this in a variable for ease of use by using the following command but replacing <YOUR TEAM NAME> with the name of your team.
```shell
REGISTRY="$(oc get route/default-route -n openshift-image-registry -o=jsonpath='{.spec.host}')/<YOUR TEAM NAME>"
```
5. Log into the internal Openshift container registry
```shell
podman login -u user -p $(oc whoami -t) ${REGISTRY}
```
6. From the *database* directory, build the docker image. 
```shell
podman build -t ${REGISTRY}/faqdb:latest .
```
7. Push the built container image to the Openshift internal image registry.
```shell
podman push ${REGISTRY}/faqdb:latest
```
8. Create an Openshift deployment for the database
```shell
oc new-app faqdb -e MYSQL_USER=${DB_USER} -e MYSQL_PASSWORD=${DB_PASS} -e MYSQL_DATABASE=${DB_NAME} -e MYSQL_RANDOM_ROOT_PASSWORD=true
```

In Openshift you should now be able to see a deployment called _faqdb_ which has a single running pod.

### Deploying the application layer

The application layer consists of an API written in NodeJs. Steps 1 to 5 of these instructions can be ignored if you have already deployed the database layer using the same terminal.

1. Set up some environment variables to aid with deployment. 
```shell
export DB_USER=apiuser DB_PASS=apiuserP#ssword DB_NAME=faqs DB_HOST=faqdb
```
2. In your terminal window, log into your Openshift cluster. To obtain the login command for your cluster, navigate to the cluster console in your browser, click your username in the top right corner, and then click *Copy login command* followed by *Display Token*.
3. In your terminal window, change to the Openshift project for your Hackathon team by using the following command but replacing <YOUR TEAM NAME> with the name of your team.
```shell
oc project <YOUR TEAM NAME>
```
4. Get the internal imgae registry URL and store this in a variable for ease of use by using the following command but replacing <YOUR TEAM NAME> with the name of your team.
```shell
REGISTRY="$(oc get route/default-route -n openshift-image-registry -o=jsonpath='{.spec.host}')/<YOUR TEAM NAME>"
```
5. Log into the internal Openshift container registry
```shell
podman login -u user -p $(oc whoami -t) ${REGISTRY}
```
6. From the *application* directory, build the docker image. 
```shell
podman build -t ${REGISTRY}/faqapi:latest .
```
7. Push the built container image to the Openshift internal image registry.
```shell
podman push ${REGISTRY}/faqapi:latest
```
8. Create an Openshift deployment for the application layer
```shell
oc new-app faqapi -e DB_USER=${DB_USER} -e DB_PASS=${DB_PASS} -e DB_NAME=${DB_NAME} -e DB_HOST=${DB_HOST}
```
9. Expose the API service
```shell
oc create route edge --service faqapi
```
10. Retrieve the url for your deployed application tier and assign it to a variable for testing.
```shellz
export API_ENDPOINT=$(oc get route faqapi -o jsonpath='{.spec.host}')
```

In Openshift you should now be able to see a deployment called _faqapi_ which has a single running pod. As we have exposed the API you can test it's functionality before proceeding with the following commands:

```shell
# Get all FAQs
curl -i -X GET -H 'Accept: application/json' https://${API_ENDPOINT}/faqs

# Get an FAQ by id
curl -i -X GET -H 'Accept: application/json' https://${API_ENDPOINT}/faqs/1

# Post a new FAQ
curl -i -X POST -H 'Accept: application/json' -H 'Content-type: application/json' https://${API_ENDPOINT}/faqs --data '{"question":"My new FAQ?", "answer": "My new answer"}'

# Update a FAQ
curl -i -X PUT -H 'Accept: application/json' -H 'Content-type: application/json' https://${API_ENDPOINT}/faqs/4 --data '{"question":"My new FAQ?", "answer": "My updated answer"}'

# Delete a FAQ
curl -i -X DELETE -H 'Accept: application/json' -H 'Content-type: application/json' https://${API_ENDPOINT}/faqs/4
```

### Deploying the front end
The front end consists of an simple react app that allows interaction with the api already deployed. Steps 1 to 4 of these instructions can be ignored if you have already deployed the database layer using the same terminal.

1. In your terminal window, log into your Openshift cluster. To obtain the login command for your cluster, navigate to the cluster console in your browser, click your username in the top right corner, and then click *Copy login command* followed by *Display Token*.
2. In your terminal window, change to the Openshift project for your Hackathon team by using the following command but replacing <YOUR TEAM NAME> with the name of your team.
```shell
oc project <YOUR TEAM NAME>
```
3. Get the internal imgae registry URL and store this in a variable for ease of use by using the following command but replacing <YOUR TEAM NAME> with the name of your team.
```shell
REGISTRY="$(oc get route/default-route -n openshift-image-registry -o=jsonpath='{.spec.host}')/<YOUR TEAM NAME>"
```
4. Log into the internal Openshift container registry
```shell
podman login -u user -p $(oc whoami -t) ${REGISTRY}
```
5. Generate the full API URL for use by the front end and copy the resulting text as this will be needed in step 6.
```shell
API_URL="REACT_APP_API_BASE_URL=https://"$(oc get route faqapi -o jsonpath='{.spec.host}')"/faqs"
echo $API_URL
```
6. Working in the *frontend* directory, open the file named _Dockerfile_ and then, on line 15 of the replace the text ###API_URL### with the value returned in the previous step. Note only replace the stated text, not the entire line and then save the file. After completing this step the line should look similar to this example:

`RUN echo REACT_APP_API_BASE_URL=https://faqapi-testing-group.lbg-sdlc-hackathon-cluste-ecf58268eb10995f067698dffc82d2a7-0000.eu-gb.containers.appdomain.cloud/faqs > .env`


7. From the *frontend* directory, build the docker image. 
```shell
podman build -t ${REGISTRY}/faqfrontend:latest .
```
8. Push the built container image to the Openshift internal image registry.
```shell
podman push ${REGISTRY}/faqfrontend:latest
```
9. Create an Openshift deployment for the application layer
```shell
oc new-app faqfrontend:latest
```
10. Expose the service to make the frontend accessible
```shell
oc create route edge --service=faqfrontend
```
11. Retrieve the url for your deployed application
```shell
oc get route faqfrontend -o jsonpath='{.spec.host}'
```
12. Open your browser and navigate to the url returned in the previous step

## Deploying via Jenkins Pipeline

### Prerequisites
- An openshift cluster with appropriate permissions to create deployments
- A container registry for storing images (instructions assume usage of the internal OCP registry)
- A Jenkins instance deployed on OpenShift

1. A Jenkins instance is running in Openshift for your convenience. To access the Jenkins instance log into Openshift, click Administrator > Networking > Routes, then click on the "jenkins" url in the Location column.

2. To enable Jenkins to read the Github repository containing the application code, you will need to connect Jenkins to your GitHub account. To do this, navigate to your GitHub profile settings in your browser by logging into Github, clicking on your profile picture in the top right and then clicking Settings. In your profile settings, on the left hand side scroll down to Developer Settings and click Personal Access Tokens > Tokens (classic) then in the top bar click Generate new token > Generate new token (classic). Copy and note down the token given for later.

3. On the Jenkins webpage, on the left hand side, scroll down to Manage Jenkins. In Manage Jenkins, scroll down and click the Credentials button in the Security section. Click System in the Credentials section, then Global Credentials (unrestricted). 

4. Inside this page click "+ Add credentials", leave ensure the Kind is set as _Username with password_, leave Scope set at it's default and enter the following values for the remaining options: 

    ```shell
    Username: git
    Password: <ENTER TOKEN FROM GITHUB>
    ID: git-token
    ```

    Click Create to save the credential.

5. Click _Dashboard_ in the top left of the Jenkins screen and then click _+ New Item_ to create a new pipeline.

6. Enter the item name as *Deploy App*, select "Pipeline", and then click "OK". 

7. On the configuration screen, click on _Pipeline_, then for the definition, select "Pipeline script from SCM", set SCM to "Git" and for the repository url enter the https clone url for the GitHub repository. 

8. In the credentials box, select the credential created in step 4. This will be shown as "git/******". Now click save and apply.

9. The pipeline should now automatically run for the first time but will not deploy anything as the first run simply fetches the Jenkinsfile. If the pipeline does not start automatically, click "Build" on the left hand side of the screen. After the first run has completed, reload the page. You should now see a _Build with parameters_
option on the left.

10. Click _Build with parameters_ and then select the three checkboxes DEPLOY_DATABASE, DEPLOY_BACKEND and DEPLOY_FRONTEND. Click _Change Password_ next to the DB_PASS parameter, type in a random password value and then click _BUILD_

11. The pipeline will now deploy the application. Once the deployment completes you will be able to access the applications front end by logging into the Openshift console, clicking Networking followed by Routes and then clicking on the Location link for the "faqfrontend".

#### Congratulations! You have deployed the app with Jenkins!

