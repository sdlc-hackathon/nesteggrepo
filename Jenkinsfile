pipeline {
    agent any

    parameters {
        booleanParam(name: 'DEPLOY_DATABASE', defaultValue: false, description: 'Option to deploy database')
        booleanParam(name: 'DEPLOY_BACKEND', defaultValue: false, description: 'Option to deploy backend API application')
        booleanParam(name: 'DEPLOY_FRONTEND', defaultValue: false, description: 'Option to deploy frontend')
        string(name: 'DB_IMAGE_NAME', defaultValue: 'faqdb', description: 'Database image name')
        string(name: 'BACKEND_IMAGE_NAME', defaultValue: 'faqapi', description: 'Backend image name')
        string(name: 'FRONTEND_IMAGE_NAME', defaultValue: 'faqfrontend', description: 'Frontend image name')
        string(name: 'DB_USER', defaultValue: 'apiuser', description: 'Database username')
        password(name: 'DB_PASS', defaultValue: '', description: 'Database password. Ensure you set this whenever you deploy the database or backend.') // Using 'password' type for sensitive data
        string(name: 'DB_NAME', defaultValue: 'faqs', description: 'Database name')
        string(name: 'DB_HOST', defaultValue: 'faqdb', description: 'Database host name')
    }

    stages {

        // PRE-REQUISITES
        
        stage('Checkout') {
            steps {
                // Checkout your source code
                checkout scm
            }
        }

        // DATABASE STAGE

        stage('Create Database Openshift Deployment') {
            when {
                expression {
                    params.DEPLOY_DATABASE
                }
            }

            steps {
                script {
                    openshift.withCluster("mycluster") {
                        echo "Hello from project ${openshift.project()} in cluster ${openshift.cluster()}"

                        sh '''
                            cd "${WORKSPACE}/database"

                            cat Dockerfile

                            lastResult=$(oc get bc -o name | grep ${DB_IMAGE_NAME}) || continue
                            echo $lastResult

                            # if lastResult is not empty, run build config
                            if [ -n "$lastResult" ]; then
                                oc start-build ${DB_IMAGE_NAME} --from-dir=. --follow
                            else
                                # manually creating build config, image stream
                                oc new-build --binary --strategy=docker --name=${DB_IMAGE_NAME} --to=${DB_IMAGE_NAME}:${BUILD_NUMBER}

                                # manually starting build
                                oc start-build ${DB_IMAGE_NAME} --from-dir=. --follow

                                # manually creating deployment, pods, replication controllers, service etc
                                oc new-app -i ${DB_IMAGE_NAME}:${BUILD_NUMBER} \
                                -e MYSQL_USER=${DB_USER} \
                                -e MYSQL_PASSWORD=${DB_PASS} \
                                -e MYSQL_DATABASE=${DB_NAME} \
                                -e MYSQL_RANDOM_ROOT_PASSWORD=true
                            fi
                        '''
                    }
                }
            }

            post {
                aborted {
                    echo 'Database stage aborted'
                }
                success {
                    echo 'Database stage successful'
                }
                always {
                    echo 'Database stage run'
                }
            }
        }

        // BACKEND STAGE

        stage('Create Backend Openshift Deployment') {
            when {
                expression {
                    params.DEPLOY_BACKEND
                }
            }
            steps {
                script {
                    openshift.withCluster("mycluster") {
                        echo "Hello from project ${openshift.project()} in cluster ${openshift.cluster()}"

                        sh '''
                            cd "${WORKSPACE}/application"

                            # Editing Dockerfile to directly create environment variable
                            sed -i "s|###DB_USER###|${DB_USER}|" Dockerfile
                            sed -i "s|###DB_PASS###|${DB_PASS}|" Dockerfile
                            sed -i "s|###DB_NAME###|${DB_NAME}|" Dockerfile
                            sed -i "s|###DB_HOST###|${DB_IMAGE_NAME}|" Dockerfile

                            cat Dockerfile

                            lastResult=$(oc get bc -o name | grep ${BACKEND_IMAGE_NAME}) || continue
                            echo $lastResult

                            # if lastResult is not empty, run build config
                            if [ -n "$lastResult" ]; then
                                oc start-build ${BACKEND_IMAGE_NAME} --from-dir=. --follow
                            else
                                # manually creating build config
                                oc new-build --binary --strategy=docker --name=${BACKEND_IMAGE_NAME} --to=${BACKEND_IMAGE_NAME}:${BUILD_NUMBER}

                                # manually starting build
                                oc start-build ${BACKEND_IMAGE_NAME} --from-dir=. --follow
                                
                                # manually creating deployment, pods, replication controllers, service etc
                                oc new-app -i ${BACKEND_IMAGE_NAME}:${BUILD_NUMBER}
                                
                                # creating https route
                                oc create route edge --service ${BACKEND_IMAGE_NAME}
                            fi
                        '''
                    }
                }
            }

            post {
                aborted {
                    echo 'Backend stage aborted'
                }
                success {
                    echo 'Backend stage successful'
                }
                always {
                    echo 'Backend stage run'
                }
            }
        }

        // FRONTEND STAGE

        stage('Create Frontend Openshift Deployment') {
            when {
                expression {
                    params.DEPLOY_FRONTEND
                }
            }
            steps {
                script {
                    openshift.withCluster("mycluster") {
                        echo "Hello from project ${openshift.project()} in cluster ${openshift.cluster()}"

                        sh '''
                            cd "${WORKSPACE}/frontend"

                            BACKEND_ROUTE=$(oc get route ${BACKEND_IMAGE_NAME} -o jsonpath='{.spec.host}')
                            API="REACT_APP_API_BASE_URL=https://${BACKEND_ROUTE}/faqs"
                            echo $API

                            # Editing Dockerfile to directly create environment variable
                            sed -i "s|###API_URL###|${API}|" Dockerfile

                            lastResult=$(oc get bc -o name | grep ${FRONTEND_IMAGE_NAME}) || continue
                            echo $lastResult

                            # if lastResult is not empty, run build config
                            if [ -n "$lastResult" ]; then
                                oc start-build ${FRONTEND_IMAGE_NAME} --from-dir=. --follow
                            else
                                # manually creating build config
                                oc new-build --binary --strategy=docker --name=${FRONTEND_IMAGE_NAME} --to=${FRONTEND_IMAGE_NAME}:${BUILD_NUMBER}

                                # manually starting build
                                oc start-build ${FRONTEND_IMAGE_NAME} --from-dir=. --follow
                                
                                # manually creating deployment, pods, replication controllers, service etc
                                oc new-app -i ${FRONTEND_IMAGE_NAME}:${BUILD_NUMBER}
                                
                                # creating https route
                                oc create route edge --service ${FRONTEND_IMAGE_NAME}
                            fi

                            FRONTEND_ROUTE=$(oc get route faqfrontend -o jsonpath='{.spec.host}')
                            echo "Here is the URL for your application:"
                            echo ${FRONTEND_ROUTE}
                        '''
                    }
                }
            }

            post {
                aborted {
                    echo 'Frontend stage aborted'
                }
                success {
                    echo 'Frontend stage successful'
                }
                always {
                    echo 'Frontend stage has run'
                }
            }
        }
    }

    post {
        aborted {
            echo 'Pipeline aborted'
        }
        success {
            echo 'Pipeline successful'
        }
        always {
            echo 'Pipeline has run'
        }
    }
}
