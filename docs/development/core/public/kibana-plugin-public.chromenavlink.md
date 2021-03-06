<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-public](./kibana-plugin-public.md) &gt; [ChromeNavLink](./kibana-plugin-public.chromenavlink.md)

## ChromeNavLink interface


<b>Signature:</b>

```typescript
export interface ChromeNavLink 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [active](./kibana-plugin-public.chromenavlink.active.md) | <code>boolean</code> | Indicates whether or not this app is currently on the screen. |
|  [baseUrl](./kibana-plugin-public.chromenavlink.baseurl.md) | <code>string</code> | The base route used to open the root of an application. |
|  [disabled](./kibana-plugin-public.chromenavlink.disabled.md) | <code>boolean</code> | Disables a link from being clickable. |
|  [disableSubUrlTracking](./kibana-plugin-public.chromenavlink.disablesuburltracking.md) | <code>boolean</code> | A flag that tells legacy chrome to ignore the link when tracking sub-urls |
|  [euiIconType](./kibana-plugin-public.chromenavlink.euiicontype.md) | <code>string</code> | A EUI iconType that will be used for the app's icon. This icon takes precendence over the <code>icon</code> property. |
|  [hidden](./kibana-plugin-public.chromenavlink.hidden.md) | <code>boolean</code> | Hides a link from the navigation. |
|  [icon](./kibana-plugin-public.chromenavlink.icon.md) | <code>string</code> | A URL to an image file used as an icon. Used as a fallback if <code>euiIconType</code> is not provided. |
|  [id](./kibana-plugin-public.chromenavlink.id.md) | <code>string</code> | A unique identifier for looking up links. |
|  [linkToLastSubUrl](./kibana-plugin-public.chromenavlink.linktolastsuburl.md) | <code>boolean</code> | Whether or not the subUrl feature should be enabled. |
|  [order](./kibana-plugin-public.chromenavlink.order.md) | <code>number</code> | An ordinal used to sort nav links relative to one another for display. |
|  [subUrlBase](./kibana-plugin-public.chromenavlink.suburlbase.md) | <code>string</code> | A url base that legacy apps can set to match deep URLs to an application. |
|  [title](./kibana-plugin-public.chromenavlink.title.md) | <code>string</code> | The title of the application. |
|  [tooltip](./kibana-plugin-public.chromenavlink.tooltip.md) | <code>string</code> | A tooltip shown when hovering over an app link. |
|  [url](./kibana-plugin-public.chromenavlink.url.md) | <code>string</code> | A url that legacy apps can set to deep link into their applications. |

