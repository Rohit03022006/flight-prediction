pipeline {
    agent any
    environment {
        BACKEND_IMAGE = 'rohitxten/flight_price_backend:latest'
        FRONTEND_IMAGE = 'rohitxten/flight_price_frontend:latest'
        SONAR_SCANNER_HOME = tool 'Sonar'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Rohit03022006/flight-prediction.git'
            }
        }
        
        stage('SonarQube Quality Analysis') {
            steps {
                withSonarQubeEnv('Sonar') {
                    sh """
                    ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectName="Predicts flight ticket" \
                      -Dsonar.projectKey="Predicts_flight_ticket" \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=\${SONAR_HOST_URL} \
                      -Dsonar.login=\${SONAR_AUTH_TOKEN}
                    """
                }
            }
        }
        
        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --format HTML --format XML', odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        
        stage('Sonar Quality Gate Check') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        
        stage('Trivy File System Scan') {
            steps {
                sh 'trivy fs --security-checks vuln,config --severity HIGH,CRITICAL --format table -o trivy-fs-report.html .'
            }
        }
        
        stage('Trivy Image Scan') {
            steps {
                sh """
                trivy image --security-checks vuln --severity HIGH,CRITICAL --format table -o trivy-backend-report.html $BACKEND_IMAGE
                trivy image --security-checks vuln --severity HIGH,CRITICAL --format table -o trivy-frontend-report.html $FRONTEND_IMAGE
                """
            }
        }
        
        stage('Build and Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DockerHubCredential',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    docker login -u "$DOCKER_USER" -p "$DOCKER_PASS"
                    
                    # Build and push backend
                    docker build -t $BACKEND_IMAGE ./backend
                    docker push $BACKEND_IMAGE
                    
                    # Build and push frontend
                    docker build -t $FRONTEND_IMAGE ./frontend
                    docker push $FRONTEND_IMAGE
                    """
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                script {
                    sh '''
                    docker stop flight-frontend flight-backend flight-mongo || true
                    docker rm flight-frontend flight-backend flight-mongo || true
                    '''
                    
                    sh 'docker network create flight-network || true'
                    
                    sh '''
                    docker run -d \
                      --name flight-mongo \
                      --network flight-network \
                      --restart unless-stopped \
                      -v mongo-data:/data/db \
                      -p 27017:27017 \
                      mongo:6.0
                    '''
                    
                    sh 'sleep 10'
                    
                    sh """
                    docker run -d \
                      --name flight-backend \
                      --network flight-network \
                      --restart unless-stopped \
                      -e MONGO_URI=mongodb://flight-mongo:27017 \
                      -e DB_NAME=flightdb \
                      -e MODEL_PATH=/app/model.pkl \
                      -p 5000:5000 \
                      $BACKEND_IMAGE
                    """
                    
                    sh 'sleep 15'
                    
                    sh """
                    docker run -d \
                      --name flight-frontend \
                      --network flight-network \
                      --restart unless-stopped \
                      -e REACT_APP_BACKEND_URL=http://localhost:5000 \
                      -p 80:80 \
                      $FRONTEND_IMAGE
                    """
                }
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed! Check the logs for details.'
            sh 'docker logs flight-backend || true'
            sh 'docker logs flight-frontend || true'
            sh 'docker logs flight-mongo || true'
        }
        success {
            echo 'Pipeline succeeded! Application deployed successfully.'
            sh 'docker ps --filter name=flight-'
        }
        always {
            sh 'docker logout || true'
            
            archiveArtifacts artifacts: '**/*report.html', allowEmptyArchive: true
            archiveArtifacts artifacts: '**/dependency-check-report.*', allowEmptyArchive: true
        }
    }
}
