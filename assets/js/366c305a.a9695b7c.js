"use strict";(self.webpackChunkwebdocs=self.webpackChunkwebdocs||[]).push([[928],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>v});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):d(d({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},l="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),l=s(n),g=a,v=l["".concat(p,".").concat(g)]||l[g]||u[g]||o;return n?r.createElement(v,d(d({ref:t},c),{},{components:n})):r.createElement(v,d({ref:t},c))}));function v(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,d=new Array(o);d[0]=g;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[l]="string"==typeof e?e:a,d[1]=i;for(var s=2;s<o;s++)d[s]=n[s];return r.createElement.apply(null,d)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},764:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>d,default:()=>v,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:11,sidebar_label:"Drag and drop events",description:"Use drag and drop to edit events quickly"},d="Drag and drop",i={unversionedId:"guides/drag-drop",id:"guides/drag-drop",title:"Drag and drop",description:"Use drag and drop to edit events quickly",source:"@site/docs/guides/drag-drop.mdx",sourceDirName:"guides",slug:"/guides/drag-drop",permalink:"/react-native-week-view/guides/drag-drop",draft:!1,editUrl:"https://github.com/hoangnm/react-native-week-view/tree/master/webdocs/docs/guides/drag-drop.mdx",tags:[],version:"current",sidebarPosition:11,frontMatter:{sidebar_position:11,sidebar_label:"Drag and drop events",description:"Use drag and drop to edit events quickly"},sidebar:"tutorialSidebar",previous:{title:"All-day events",permalink:"/react-native-week-view/guides/all-day-events"},next:{title:"Edit by dragging borders",permalink:"/react-native-week-view/guides/edit-event"}},p={},s=[],c=(l="CodeDemo",function(e){return console.warn("Component "+l+" was not imported, exported, or provided by MDXProvider as global scope"),(0,a.kt)("div",e)});var l;const u={toc:s},g="wrapper";function v(e){let{components:t,...o}=e;return(0,a.kt)(g,(0,r.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"drag-and-drop"},"Drag and drop"),(0,a.kt)("p",null,"Use the props ",(0,a.kt)("a",{parentName:"p",href:"../full-api/week-view-props#ondragevent"},(0,a.kt)("inlineCode",{parentName:"a"},"onDragEvent"))," and ",(0,a.kt)("a",{parentName:"p",href:"../full-api/week-view-props#drageventconfig"},(0,a.kt)("inlineCode",{parentName:"a"},"dragEventConfig"))," to setup event drag and drop.\nAll-day events cannot be dragged.\nSee the following basic example."),(0,a.kt)(c,{imgSrc:n(263).Z,mdxType:"CodeDemo"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="Drag and drop"',title:'"Drag',and:!0,'drop"':!0},"const eventsReducer = (prevEvents, payload) => {\n  // Just an example reducer, you'll probably use your own\n  const {event, newStartDate, newEndDate} = payload;\n  return [\n    ...prevEvents.filter(e => e.id !== event.id),\n    {\n      ...event,\n      startDate: newStartDate,\n      endDate: newEndDate,\n    },\n  ];\n};\n\nconst MyComponent = () => {\n  const [events, updateEvent] = useReducer(eventsReducer, []);\n\n  return (\n    <WeekView\n      events={events}\n      onDragEvent={(event, newStartDate, newEndDate) => {\n        // Here you must update the event in your local DB\n        updateEvent({ event, newStartDate, newEndDate })\n      }}\n    />\n  );\n}\n"))))}v.isMDXComponent=!0},263:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/drag-drop-2fa6a86fa4291bf3de3191dec588213b.gif"}}]);