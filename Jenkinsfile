pipeline {
    agent any
    environment {
        BACKEND_IMAGE = 'rohitxten/flight_price_backend:latest'
        FRONTEND_IMAGE = 'rohitxten/flight_price_frontend:latest'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Rohit03022006/flight-prediction.git'
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
                // Stop and remove any existing containers
                sh 'docker stop flight-frontend flight-backend flight-mongo || true'
                sh 'docker rm flight-frontend flight-backend flight-mongo || true'
                
                // Start MongoDB
                sh '''
                docker run -d \
                  --name flight-mongo \
                  --restart unless-stopped \
                  -v mongo-data:/data/db \
                  -p 27017:27017 \
                  mongo:6.0
                '''
                
                // Start Backend
                sh """
                docker run -d \
                  --name flight-backend \
                  --restart unless-stopped \
                  --link flight-mongo:mongo \
                  -e MONGO_URI=mongodb://mongo:27017 \
                  -e DB_NAME=flightdb \
                  -e MODEL_PATH=/app/model.pkl \
                  -p 5000:5000 \
                  $BACKEND_IMAGE
                """
                
                // Start Frontend
                sh """
                docker run -d \
                  --name flight-frontend \
                  --restart unless-stopped \
                  --link flight-backend:backend \
                  -e REACT_APP_BACKEND_URL=http://flight-backend:5000 \
                  -p 80:80 \
                  $FRONTEND_IMAGE
                """
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed! Check the logs for details.'
            sh 'docker logs flight-backend || true'
            sh 'docker logs flight-frontend || true'
        }
        success {
            echo 'Pipeline succeeded! Application deployed successfully.'
            sh 'docker ps --filter "name=flight-"'
        }
        always {
            // Clean up credentials
            sh 'docker logout || true'
        }
    }
}
