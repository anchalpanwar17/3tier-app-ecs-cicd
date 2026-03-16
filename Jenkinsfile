pipeline {
    agent { label 'slave' }

    environment {
        AWS_REGION = "us-east-1"
        ACCOUNT_ID = "374508015037"

        BACKEND_REPO = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/task-app-backend"
        FRONTEND_REPO = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/task-app-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t $BACKEND_REPO:$IMAGE_TAG ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t $FRONTEND_REPO:$IMAGE_TAG ./frontend
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin \
                $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                docker push $BACKEND_REPO:$IMAGE_TAG
                docker push $FRONTEND_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy Backend ECS Service') {
            steps {
                sh '''
                aws ecs update-service \
                --cluster task-app-cluster \
                --service backend-3-tier-service \
                --force-new-deployment \
                --region $AWS_REGION
                '''
            }
        }

        stage('Deploy Frontend ECS Service') {
            steps {
                sh '''
                aws ecs update-service \
                --cluster task-app-cluster \
                --service new-frontend-task-td-service \
                --force-new-deployment \
                --region $AWS_REGION
                '''
            }
        }

    }

    post {
        success {
            echo "Deployment successful"
        }

        failure {
            echo "Pipeline failed"
        }
    }
}