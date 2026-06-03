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
    stage('Install & Test') {
      steps {
        sh 'npm install'
        sh 'CI=true npm test'
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
    stage('Analyze Image') {
      steps {
        sh "CI=true dive docker://${dockerImage.id}"
        grypeScan scanDest: "${dockerImage.id}", repName: 'myScanResult.txt', autoInstall:true
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
  post {
    always {
      recordIssues(
          tools: [grype()],
          aggregatingResults: true,
          failedTotalHigh: 10, //fail if >=10 HIGHs
          failedTotalAll: 20 //fail if >=20 issues in total
      )
    }
  }
}
