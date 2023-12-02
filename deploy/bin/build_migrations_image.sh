#!/bin/bash

set -e -o pipefail

# -------------- args ---------------- #
cmd=$1

# ----------- defaults --------------- #
if [ -z "${AWS_REGION}" ]; then
  export AWS_REGION=us-east-1
fi

COMMIT_SHA=$(git rev-parse head)

# name of current directory
PROJECT=$(printf '%q\n' "${PWD##*/}")
echo $PROJECT

# ----------- functions -------------- #
function _help() {
  echo "Usage: "
  echo "./deploy/bin/build.sh [cmd]"
  echo "* cmd: Optionally include 'push' value as first argument to push to ECR"
}

function aws_install() {
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip -q awscliv2.zip
  ./aws/install
}

function ecr_login() {
  # awscli v2 login:
  aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $account_id.dkr.ecr.$AWS_REGION.amazonaws.com
  # awscli v1 login:
  # $(aws ecr get-login --no-include-email --region $AWS_REGION)
}

# ---------- entry point ------------- #
if [ "${cmd}" == "help" ]; then
  _help
  exit 0
fi

aws --version || aws_install
ecr_login

base_uri=$account_id.dkr.ecr.$AWS_REGION.amazonaws.com/$PROJECT
image=$base_uri:$COMMIT_SHA
image_latest=$base_uri:latest

docker build -t $image -f deploy/migrations.Dockerfile .

if [ "$cmd" == "push" ]; then
  docker push $image
  docker tag $image $image_latest
  docker push $image_latest
fi
