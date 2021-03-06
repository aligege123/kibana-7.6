<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-public](./kibana-plugin-public.md) &gt; [HttpInterceptor](./kibana-plugin-public.httpinterceptor.md)

## HttpInterceptor interface

An object that may define global interceptor functions for different parts of the request and response lifecycle. See [IHttpInterceptController](./kibana-plugin-public.ihttpinterceptcontroller.md)<!-- -->.

<b>Signature:</b>

```typescript
export interface HttpInterceptor 
```

## Methods

|  Method | Description |
|  --- | --- |
|  [request(request, controller)](./kibana-plugin-public.httpinterceptor.request.md) | Define an interceptor to be executed before a request is sent. |
|  [requestError(httpErrorRequest, controller)](./kibana-plugin-public.httpinterceptor.requesterror.md) | Define an interceptor to be executed if a request interceptor throws an error or returns a rejected Promise. |
|  [response(httpResponse, controller)](./kibana-plugin-public.httpinterceptor.response.md) | Define an interceptor to be executed after a response is received. |
|  [responseError(httpErrorResponse, controller)](./kibana-plugin-public.httpinterceptor.responseerror.md) | Define an interceptor to be executed if a response interceptor throws an error or returns a rejected Promise. |

