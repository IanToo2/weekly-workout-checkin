#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
JDK_DIR="${BACKEND_DIR}/.tools/jdk-17"
TMP_DIR="${BACKEND_DIR}/.tools/tmp"
ARCHIVE_PATH="${TMP_DIR}/jdk17.tar.gz"
JDK_URL="${JDK_URL:-https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse}"

if [[ -x "${JDK_DIR}/bin/java" ]]; then
  echo "Local JDK already exists: ${JDK_DIR}"
  exit 0
fi

mkdir -p "${TMP_DIR}"
mkdir -p "${BACKEND_DIR}/.tools"

echo "Downloading JDK 17 to ${ARCHIVE_PATH}"
curl -fL "${JDK_URL}" -o "${ARCHIVE_PATH}"

echo "Extracting to ${JDK_DIR}"
rm -rf "${JDK_DIR}"
mkdir -p "${JDK_DIR}"
tar -xzf "${ARCHIVE_PATH}" --strip-components=1 -C "${JDK_DIR}"

echo "Installed local JDK: ${JDK_DIR}"
"${JDK_DIR}/bin/java" -version
