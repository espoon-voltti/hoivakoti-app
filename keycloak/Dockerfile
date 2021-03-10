FROM jboss/keycloak:11.0.3

USER root

ENV DB_VENDOR POSTGRES
ENV DB_DATABASE postgres
ENV DB_SCHEMA public
ENV PROXY_ADDRESS_FORWARDING true

EXPOSE 8080 8443

CMD ["-b", "0.0.0.0", "-Dkeycloak.profile.feature.upload_scripts=enabled" ]
