<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-server](./kibana-plugin-server.md) &gt; [GetAuthState](./kibana-plugin-server.getauthstate.md)

## GetAuthState type

Get authentication state for a request. Returned by `auth` interceptor.

<b>Signature:</b>

```typescript
export declare type GetAuthState = (request: KibanaRequest | LegacyRequest) => {
    status: AuthStatus;
    state: unknown;
};
```
