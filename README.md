# [[PROJECT]]-app

Example Voltti application repository. Needs modification before using.

Contains:

- Example CircleCI configuration
    - Building Gradle apps
    - Running tests with a PostgreSQL DB
    - Terraform deploy to `dev`, `test`, `staging` and `prod` -- with gated approval
- Terraform configuration and tooling for a simple ECS service
- GitHub PR template

## TEMPLATE INFORMATION

This is the Voltti infra repository template.

Usage:

1. Select "Use this template" on this page to create a new repository
1. Select all GitHub apps you'd like to use with this repository (at least CircleCI Checks)
1. Remove this information block from the README
1. Update all files and directories with your project name:

        # NOTE: Replace $PROJECT with your project name
        # Rename placeholder references in files
        git grep --cached -Ilz '' | xargs -0 sed -e 's/\[\[PROJECT\]\]/$PROJECT/g'

1. Configure the GitHub repository settings, at least:
     - Branch protection rules
     - Access to `Voltti*` groups
          - Voltti Admins: admin access
          - Voltti Developers: write (or maintain) access
          - Voltti Readers: read access
     - "Automatically delete head branches"

**************************************************
**************************************************
**************************************************
**************************************************

## Requirements

* Terraform 0.11.8 (recommended tool: [Terraform version manager](https://github.com/tfutils/tfenv))
* Valid AWS CLI configuration (see [Confluence](https://voltti.atlassian.net/wiki/spaces/VI/pages/261062669/AWS-monitiliymp+rist+n+k+ytt+minen) for details on Voltti accounts)

## Development

### Infra and deployment

1. Go to module directory to be deployed, for example _terraform_
2. If not done previously do the setup: `terraform init`
3. To see available workspaces: `terraform workspace list`
4. To select workspace _dev_: `terraform workspace select dev`
5. To see the planned changes: `terraform plan`
6. To apply the planned changes to AWS: `terraform apply`

Remember to commit and push changes to this repository

### Fix forward

> When a code change A is rejected, don't think necessarily in terms of "rollback feature A by undoing the merge using SCCS". Think in terms of "adding a new change to the code which fixes the defects found by QA".

> Looking at the timeline, after each test cycle your "master" can switch between two main states: either it has "known defects", or there are "no known defects any more". Whenever it reaches the state "no known defects", you can deploy to production. To make continous deployment work, one has to plan the feature slices in a way the state "no known defects any more" is reached as frequent as possible.

https://softwareengineering.stackexchange.com/questions/350017/how-to-rollback-rejected-features-by-qa-in-a-continuous-delivery-scenario


### Commit guidelines

See [Commit Message Format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
