# serverless-run-remote-migrations
Run database migrations against your database instance before deploying your serverless app.

## Configuration
`serverless.yml`
```YAML
plugins:
  - serverless-run-remote-migrations

...

custom:
  # Default config values:
  serverless-run-remote-migrations:
    # docker image build that contains database migrations code
    build:
      dockerfile: path/to/Dockerfile
      context: . # See https://docs.docker.com/build/building/context
      # Recommended to tag code with current commit SHA (i.e. export COMMIT_SHA=$(git rev-parse HEAD) and use ${env:COMMIT_SHA})
      tag: latest # https://docs.docker.com/engine/reference/commandline/tag/
    deploy:
      cpu: 256
      memory: 512
      # currently only aws is supported (although you can run images from Dockerhub or anywhere)
      aws:
        vpc:
          securityGroupId: sg-xxxxx # (Optional) will use default VPC security group if none provided
          subnetId: subnet-xxxxx # (Optional) will use random subnet in default VPC if none provided
          clusterName: xxxxx
```
