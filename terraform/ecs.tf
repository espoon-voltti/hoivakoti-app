locals {
  rds_url = "jdbc:postgresql://${data.terraform_remote_state.base.[[PROJECT]]-db_internal_address}:5432/[[PROJECT]]_service"
}

module [[PROJECT]]_service {
  name         = "[[PROJECT]]-service"
  docker_image = "[[PROJECT]]/service"
  docker_tag   = "${local.[[PROJECT]]-service_version}"

  health_check_path = "/actuator/health"
  desired_count     = "${var.desired_count[terraform.workspace]}"
  alert_enabled     = true
  public            = false
  businessUnit      = "${var.businessUnit}"
  applicationName   = "${var.name}"

  env_vars = [
    {
      JAVA_OPTS = "-Dspring.profiles.active=env_${terraform.workspace} -Dspring.flyway.enabled=false -Djava.security.egd=file:/dev/./urandom -Xms64m -Xmx64m -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:TieredStopAtLevel=1"
    },
    {
      SPRING_DATASOURCE_URL = "${local.rds_url}"
    },
    {
      ENV = "${terraform.workspace}"
    },
    {
      FLYWAY_URL = "${local.rds_url}"
    },
    {
      FLYWAY_PLACEHOLDERS_MIGRATION_USER = "[[PROJECT]]_service_migration"
    },
    {
      FLYWAY_PLACEHOLDERS_APPLICATION_USER = "[[PROJECT]]_service_application"
    },
  ]

  source = "git@github.com:espoon-voltti/voltti-infra.git//terraform/modules/ecs_service/"
}
