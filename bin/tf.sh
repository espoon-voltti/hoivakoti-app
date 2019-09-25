#!/bin/bash
# This script plans, builds or destroys the whole infrastructure. Modules
# need to be created one-by-one because they refer to each other through
# remote state. Remote state of a configuration is only available after
# planning the configuration.
#
# Usage: sh ./tf.sh [<action>] [<env>]

set -e
cd ./terraform
CURR_PATH="$(pwd)"

# Terraform action and environment / Terraform workspace
ACTION="${1:-plan}"
shift
ENVIRONMENT="${1:-dev}"
shift

# For builder-aws docker image
. replace-credentials

function tf {
  echo ""
  echo "##################################################"
  echo "Running 'terraform $ACTION' for $1 in workspace $2"
  echo "NOTE: Workspace $2 will remain selected"
  echo "##################################################"

  # Init terraform and select workspace
  cd "$1"
  terraform init -upgrade=true
  terraform workspace select $2

  # run terraform
  terraform $ACTION ${*:3}

  cd "$CURR_PATH"
}

tf . $ENVIRONMENT $@

