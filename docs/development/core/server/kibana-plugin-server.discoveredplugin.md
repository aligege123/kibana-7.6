<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-server](./kibana-plugin-server.md) &gt; [DiscoveredPlugin](./kibana-plugin-server.discoveredplugin.md)

## DiscoveredPlugin interface

Small container object used to expose information about discovered plugins that may or may not have been started.

<b>Signature:</b>

```typescript
export interface DiscoveredPlugin 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [configPath](./kibana-plugin-server.discoveredplugin.configpath.md) | <code>ConfigPath</code> | Root configuration path used by the plugin, defaults to "id". |
|  [id](./kibana-plugin-server.discoveredplugin.id.md) | <code>PluginName</code> | Identifier of the plugin. |
|  [optionalPlugins](./kibana-plugin-server.discoveredplugin.optionalplugins.md) | <code>readonly PluginName[]</code> | An optional list of the other plugins that if installed and enabled \*\*may be\*\* leveraged by this plugin for some additional functionality but otherwise are not required for this plugin to work properly. |
|  [requiredPlugins](./kibana-plugin-server.discoveredplugin.requiredplugins.md) | <code>readonly PluginName[]</code> | An optional list of the other plugins that \*\*must be\*\* installed and enabled for this plugin to function properly. |

