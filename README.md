# hoivakoti-app

## Requirements

* Terraform 0.11.8 (recommended tool: [Terraform version manager](https://github.com/tfutils/tfenv))
* Valid AWS CLI configuration (see [Confluence](https://voltti.atlassian.net/wiki/spaces/VI/pages/261062669/AWS-monitiliymp+rist+n+k+ytt+minen) for details on Voltti accounts)

## Development

### CI setup

- CircleCI workflows:
     - Build and persist frontend artifacts in S3
     - Build and publish backend Docker image to Voltti Docker registry (ECR)
- Deployments are done using CircleCI pipelines in https://github.com/espoon-voltti/hoivakoti-infra
     - The project's CI user has write-access to `hoivakoti-infra`
     - The user has a personal API token created an stored in Parameter Store that's
          attached to the CI workflow as `CIRCLECI_TOKEN`


### Fix forward

> When a code change A is rejected, don't think necessarily in terms of "rollback feature A by undoing the merge using SCCS". Think in terms of "adding a new change to the code which fixes the defects found by QA".

> Looking at the timeline, after each test cycle your "master" can switch between two main states: either it has "known defects", or there are "no known defects any more". Whenever it reaches the state "no known defects", you can deploy to production. To make continous deployment work, one has to plan the feature slices in a way the state "no known defects any more" is reached as frequent as possible.

https://softwareengineering.stackexchange.com/questions/350017/how-to-rollback-rejected-features-by-qa-in-a-continuous-delivery-scenario


### Commit guidelines

See [Commit Message Format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
