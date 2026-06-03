pipeline {
  agent any
  environment {
    dockerCreds = credentials('dockerhub_login') 
    registry = "${dockerCreds_USR}/vatcal"
    registryCredentials = "dockerhub_login"
    dockerImage = ""
  }
  stages {
    stage('Checkout'){
      steps {
        git url: 'https://github.com/agray998/vat-calculator.git', 
            branch: 'main'
      }
    }
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    // stage('Archive') {
    //   steps {
    //     sh 'tar -czf build.tar.gz build'
    //     archiveArtifacts 'build.tar.gz'
    //   }
    // }
    stage('Build Image') {
      steps {
        script {
          dockerImage = docker.build(registry)
        }
      }
    }
    stage("Push Image") {
      steps {
       script {
         docker.withRegistry("", registryCredentials) {
           dockerImage.push("${env.BUILD_NUMBER}")
           dockerImage.push("latest")
         }
        }
      }
    }
    stage("Clean Up") {
      steps {
        sh "docker image prune --all --force --filter 'until=48h'"
      }

    }
  }
}
