#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SETUP_SCRIPT="${SCRIPT_DIR}/setup-local-jdk.sh"
LOCAL_JDK_DIR="${BACKEND_DIR}/.tools/jdk-17"

if [[ ! -x "${LOCAL_JDK_DIR}/bin/java" ]]; then
  "${SETUP_SCRIPT}"
fi

export JAVA_HOME="${LOCAL_JDK_DIR}"
export PATH="${JAVA_HOME}/bin:${PATH}"
export MAVEN_USER_HOME="${BACKEND_DIR}/.m2"

cd "${BACKEND_DIR}"
./mvnw test "$@"
