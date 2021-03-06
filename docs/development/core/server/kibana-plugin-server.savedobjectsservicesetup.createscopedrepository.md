<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-server](./kibana-plugin-server.md) &gt; [SavedObjectsServiceSetup](./kibana-plugin-server.savedobjectsservicesetup.md) &gt; [createScopedRepository](./kibana-plugin-server.savedobjectsservicesetup.createscopedrepository.md)

## SavedObjectsServiceSetup.createScopedRepository property

Creates a [Saved Objects repository](./kibana-plugin-server.isavedobjectsrepository.md) that uses the credentials from the passed in request to authenticate with Elasticsearch.

<b>Signature:</b>

```typescript
createScopedRepository: (req: KibanaRequest, extraTypes?: string[]) => ISavedObjectsRepository;
```

## Remarks

The repository should only be used for creating and registering a client factory or client wrapper. Using the repository directly for interacting with Saved Objects is an anti-pattern. Use the Saved Objects client from the [SavedObjectsServiceStart\#getScopedClient](./kibana-plugin-server.savedobjectsservicestart.md) method or the [route handler context](./kibana-plugin-server.requesthandlercontext.md) instead.

