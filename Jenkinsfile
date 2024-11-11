pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/renzoDc-1/pathway-edu_frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Construir la imagen de Docker y pasar las variables de entorno
                    sh """
                    docker build \
                        --build-arg VITE_API_GATEWAY=${VITE_API_GATEWAY} \
                        -t frontend .
                    """
                }
            }
        }

        stage('Copy Docker Image to VM') {
            steps {
                withCredentials([file(credentialsId: 'google-cloud-jenkins', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                    sh "docker save frontend -o frontend.tar"
                    sh "gcloud compute scp frontend.tar ${GCP_INSTANCE}:/home/jenkins/ --zone=${GCP_ZONE} --project=${GCP_PROJECT}"
                }
            }
        }

        stage('Load and Run Docker Image on VM') {
            steps {
                withCredentials([file(credentialsId: 'google-cloud-jenkins', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                    sh '''
                        gcloud compute ssh ${GCP_INSTANCE} --project=${GCP_PROJECT} --zone=${GCP_ZONE} --command="
                            if ! command -v docker &> /dev/null; then
                                sudo apt update && sudo apt install -y docker.io && sudo systemctl start docker;
                            fi;

                            # Crear la red Docker si no existe
                            if ! docker network inspect my-network &> /dev/null; then
                                echo 'Creating Docker network: my-network';
                                docker network create my-network;
                            fi;

                            # Forzar la eliminación de cualquier contenedor existente de frontend
                            echo 'Forcefully removing existing frontend container (if exists)';
                            sudo docker rm -f frontend || true;

                            # Cargar la imagen desde el archivo tar
                            echo 'Loading Docker image from /home/jenkins/frontend.tar';
                            sudo docker load -i /home/jenkins/frontend.tar;

                            # Ejecutar el nuevo contenedor de frontend en el puerto 80
                            echo 'Running frontend container on port 80';
                            sudo docker run -d --name frontend --network my-network -p 80:80 frontend;

                            # Eliminar archivo tar después de cargar la imagen
                            echo 'Removing frontend.tar';
                            rm /home/jenkins/frontend.tar;
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Frontend deployment successful!'
        }
        failure {
            echo 'Frontend deployment failed.'
        }
    }
}
