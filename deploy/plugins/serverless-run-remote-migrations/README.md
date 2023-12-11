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
      dockerfile: path/to/Dockerfile # (Required)
      context: . # (Default: ".") See https://docs.docker.com/build/building/context
      # Recommended to tag code with current commit SHA (i.e. export COMMIT_SHA=$(git rev-parse HEAD) and use ${env:COMMIT_SHA}).
      # See https://docs.docker.com/engine/reference/commandline/tag/
      tag: latest # (Default: "latest") 
    deploy:
      cpu: 256 # (Default: 256)
      memory: 512 # (Default: 512)
      # currently only aws is supported (although you can run images from Dockerhub or anywhere)
      aws: # Can also use 'aws: true' here to use default VPC and default VPC security group
        stackName: any-stack-name-for-migrations-task # (Optional, a stack name will be generated like "${appName}-${stage}-migrations")
        vpc:
          securityGroupId: sg-xxxxx # (Optional) will use default VPC security group if none provided
          subnetId: subnet-xxxxx # (Optional) will use random subnet in default VPC if none provided
          autoAssignPublicIp: ENABLED # ENABLED | DISABLED (Optional) will default to true if not provided. Use false if subnetId is private
        secret: # (Options) will be omitted if not specified
          name: DATABASE_URL # (Optional) Will default to DATABASE_URL
          valueFrom: arn:aws:ssm:<region>:<account-id>:parameter/path/to/SECRET # (Required) Either SSM Parameter /arn or AWS Secret Arn to securely mount value into migrations task
```

## Usage
Run migrations in a remote task against deployed database
```bash
serverless runRemoteMigrations
```
