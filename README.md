# Axios service base for TypeScript

A base class for API services using Axios.

## Changelog

### v0.2.0

- ⚠️ The `ApiServiceBase` constructor now uses the `path` argument to fully replace the `baseUrl` value instead of just appending to it. It defaults to `/api`. This is to allow creating services for external APIs.
