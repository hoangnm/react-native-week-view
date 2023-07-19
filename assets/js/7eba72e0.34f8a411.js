"use strict";(self.webpackChunkwebdocs=self.webpackChunkwebdocs||[]).push([[845],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>h});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var d=a.createContext({}),p=function(e){var t=a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=p(e.components);return a.createElement(d.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,l=e.originalType,d=e.parentName,s=r(e,["components","mdxType","originalType","parentName"]),m=p(n),c=o,h=m["".concat(d,".").concat(c)]||m[c]||u[c]||l;return n?a.createElement(h,i(i({ref:t},s),{},{components:n})):a.createElement(h,i({ref:t},s))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=n.length,i=new Array(l);i[0]=c;var r={};for(var d in t)hasOwnProperty.call(t,d)&&(r[d]=t[d]);r.originalType=e,r[m]="string"==typeof e?e:o,i[1]=r;for(var p=2;p<l;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},3140:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>v,contentTitle:()=>h,default:()=>C,frontMatter:()=>c,metadata:()=>k,toc:()=>f});var a=n(7462),o=n(7294),l=n(3905);const i="container__Qrs",r="meta_n5ea",d="required_CIoB",p="description_kLYO",s=e=>{let{label:t,value:n}=e;return o.createElement("tr",null,o.createElement("td",null,t),o.createElement("td",null,o.createElement("code",null,n)))},m=()=>o.createElement("span",{className:d},"(required). "),u=e=>{let{type:t,required:n,defaultValue:a,children:l}=e;return o.createElement("div",{className:i},o.createElement("div",{className:p},n&&o.createElement(m,null),l),o.createElement("table",{className:r},o.createElement("tbody",null,o.createElement(s,{label:"type",value:t}),!n&&a&&o.createElement(s,{label:"default",value:a}))))},c={sidebar_position:1,sidebar_label:"WeekView props",description:"Full props list",toc_min_heading_level:2,toc_max_heading_level:4},h="WeekView props",k={unversionedId:"full-api/week-view-props",id:"full-api/week-view-props",title:"WeekView props",description:"Full props list",source:"@site/docs/full-api/week-view-props.mdx",sourceDirName:"full-api",slug:"/full-api/week-view-props",permalink:"/react-native-week-view/full-api/week-view-props",draft:!1,editUrl:"https://github.com/hoangnm/react-native-week-view/tree/master/webdocs/docs/full-api/week-view-props.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,sidebar_label:"WeekView props",description:"Full props list",toc_min_heading_level:2,toc_max_heading_level:4},sidebar:"tutorialSidebar",previous:{title:"Full API",permalink:"/react-native-week-view/category/full-api"},next:{title:"WeekView methods",permalink:"/react-native-week-view/full-api/week-view-methods"}},v={},f=[{value:"<code>events</code>",id:"events",level:3},{value:"<code>selectedDate</code>",id:"selecteddate",level:3},{value:"<code>numberOfDays</code>",id:"numberofdays",level:3},{value:"Styles and formats",id:"styles-and-formats",level:2},{value:"<code>headerStyle</code>",id:"headerstyle",level:3},{value:"<code>headerTextStyle</code>",id:"headertextstyle",level:3},{value:"<code>hourTextStyle</code>",id:"hourtextstyle",level:3},{value:"<code>hourContainerStyle</code>",id:"hourcontainerstyle",level:3},{value:"<code>eventContainerStyle</code>",id:"eventcontainerstyle",level:3},{value:"<code>eventTextStyle</code>",id:"eventtextstyle",level:3},{value:"<code>allDayEventContainerStyle</code>",id:"alldayeventcontainerstyle",level:3},{value:"<code>gridRowStyle</code>",id:"gridrowstyle",level:3},{value:"<code>gridColumnStyle</code>",id:"gridcolumnstyle",level:3},{value:"<code>formatDateHeader</code>",id:"formatdateheader",level:3},{value:"<code>formatTimeLabel</code>",id:"formattimelabel",level:3},{value:"Custom components",id:"custom-components",level:2},{value:"<code>EventComponent</code>",id:"eventcomponent",level:3},{value:"<code>AllDayEventComponent</code>",id:"alldayeventcomponent",level:3},{value:"<code>TodayHeaderComponent</code>",id:"todayheadercomponent",level:3},{value:"<code>DayHeaderComponent</code>",id:"dayheadercomponent",level:3},{value:"<code>RefreshComponent</code>",id:"refreshcomponent",level:3},{value:"Day pages configuration",id:"day-pages-configuration",level:2},{value:"<code>pageStartAt</code>",id:"pagestartat",level:3},{value:"<code>allowScrollByDay</code>",id:"allowscrollbyday",level:3},{value:"Time of day configurations",id:"time-of-day-configurations",level:2},{value:"<code>startHour</code>",id:"starthour",level:3},{value:"<code>hoursInDisplay</code>",id:"hoursindisplay",level:3},{value:"<code>beginAgendaAt</code>",id:"beginagendaat",level:3},{value:"<code>endAgendaAt</code>",id:"endagendaat",level:3},{value:"<code>timeStep</code>",id:"timestep",level:3},{value:"More configurations",id:"more-configurations",level:2},{value:"<code>showNowLine</code>",id:"shownowline",level:3},{value:"<code>nowLineColor</code>",id:"nowlinecolor",level:3},{value:"<code>showTitle</code>",id:"showtitle",level:3},{value:"<code>timesColumnWidth</code>",id:"timescolumnwidth",level:3},{value:"<code>locale</code>",id:"locale",level:3},{value:"<code>fixedHorizontally</code>",id:"fixedhorizontally",level:3},{value:"<code>isRefreshing</code>",id:"isrefreshing",level:3},{value:"<code>rightToLeft</code>",id:"righttoleft",level:3},{value:"Press callbacks",id:"press-callbacks",level:2},{value:"<code>onEventPress</code>",id:"oneventpress",level:3},{value:"<code>onEventLongPress</code>",id:"oneventlongpress",level:3},{value:"<code>onGridClick</code>",id:"ongridclick",level:3},{value:"<code>onGridLongPress</code>",id:"ongridlongpress",level:3},{value:"<code>onDayPress</code>",id:"ondaypress",level:3},{value:"<code>onMonthPress</code>",id:"onmonthpress",level:3},{value:"Scroll callbacks",id:"scroll-callbacks",level:2},{value:"<code>onSwipeNext</code>",id:"onswipenext",level:3},{value:"<code>onSwipePrev</code>",id:"onswipeprev",level:3},{value:"<code>onTimeScrolled</code>",id:"ontimescrolled",level:3},{value:"Drag props",id:"drag-props",level:2},{value:"<code>onDragEvent</code>",id:"ondragevent",level:3},{value:"<code>dragEventConfig</code>",id:"drageventconfig",level:3},{value:"Edit props",id:"edit-props",level:2},{value:"<code>onEditEvent</code>",id:"oneditevent",level:3},{value:"<code>editingEvent</code>",id:"editingevent",level:3},{value:"<code>editEventConfig</code>",id:"editeventconfig",level:3},{value:"Horizontal list optimizations",id:"horizontal-list-optimizations",level:2},{value:"<code>windowSize</code>",id:"windowsize",level:3},{value:"<code>initialNumToRender</code>",id:"initialnumtorender",level:3},{value:"<code>maxToRenderPerBatch</code>",id:"maxtorenderperbatch",level:3},{value:"<code>updateCellsBatchingPeriod</code>",id:"updatecellsbatchingperiod",level:3},{value:"Patch props",id:"patch-props",level:2},{value:"<code>prependMostRecent</code>",id:"prependmostrecent",level:3},{value:"<code>runOnJS</code>",id:"runonjs",level:3}],y={toc:f},g="wrapper";function C(e){let{components:t,...n}=e;return(0,l.kt)(g,(0,a.Z)({},y,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"weekview-props"},(0,l.kt)("inlineCode",{parentName:"h1"},"WeekView")," props"),(0,l.kt)("h3",{id:"events"},(0,l.kt)("inlineCode",{parentName:"h3"},"events")),(0,l.kt)(u,{name:"events",type:"array of EventItem",required:!0,mdxType:"Prop"},(0,l.kt)("p",null,"Events to display, in ",(0,l.kt)("inlineCode",{parentName:"p"},"Event Item")," format. See details in ",(0,l.kt)("a",{parentName:"p",href:"./event"},"EventItem docs"),".")),(0,l.kt)("h3",{id:"selecteddate"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectedDate")),(0,l.kt)(u,{name:"selectedDate",type:"Date",required:!0,mdxType:"Prop"},(0,l.kt)("p",null,"  Date to show the week-view in the first render.")),(0,l.kt)("admonition",{title:"Note",type:"info"},(0,l.kt)("p",{parentName:"admonition"},"Changing this prop after the first render will not have any effect in the week-view.\nTo actually move the week-view, use the ",(0,l.kt)("inlineCode",{parentName:"p"},"goToDate()")," method, for details see ",(0,l.kt)("a",{parentName:"p",href:"../guides/navigation#navigate-programatically"},"navigating guide"),".")),(0,l.kt)("h3",{id:"numberofdays"},(0,l.kt)("inlineCode",{parentName:"h3"},"numberOfDays")),(0,l.kt)(u,{name:"numberOfDays",type:"1 | 3 | 5 | 7",required:!0,mdxType:"Prop"},(0,l.kt)("p",null,"  Number of days to show in one page.")),(0,l.kt)("h2",{id:"styles-and-formats"},"Styles and formats"),(0,l.kt)("h3",{id:"headerstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"headerStyle")),(0,l.kt)(u,{name:"headerStyle",type:"object",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"Custom styles for header container. Example: ",(0,l.kt)("inlineCode",{parentName:"p"},"{ backgroundColor: '#4286f4', color: '#fff', borderColor: '#fff' }"))),(0,l.kt)("h3",{id:"headertextstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"headerTextStyle")),(0,l.kt)(u,{name:"headerTextStyle",type:"object",defaultValue:"{ fontSize: 12, color: 'black' }",mdxType:"Prop"},(0,l.kt)("p",null,"Custom styles for text inside header. Applied to day names and month name (i.e. title).")),(0,l.kt)("h3",{id:"hourtextstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"hourTextStyle")),(0,l.kt)(u,{name:"hourTextStyle",type:"object",defaultValue:"{ fontSize: 12, color: 'black' }",mdxType:"Prop"},(0,l.kt)("p",null,"Custom styles for text displaying hours at the left.")),(0,l.kt)("h3",{id:"hourcontainerstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"hourContainerStyle")),(0,l.kt)(u,{name:"hourContainerStyle",type:"object",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"Custom styles for the container showing hours at the left.")),(0,l.kt)("h3",{id:"eventcontainerstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"eventContainerStyle")),(0,l.kt)(u,{name:"eventContainerStyle",type:"object",defaultValue:"{ alignItems: 'center', borderRadius: 0 }",mdxType:"Prop"},(0,l.kt)("p",null,"Custom styles for each event item container. Note: the background color and (absolute) positioning are already set.")),(0,l.kt)("h3",{id:"eventtextstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"eventTextStyle")),(0,l.kt)(u,{name:"eventTextStyle",type:"object",defaultValue:"{ color: '#fff', textAlign: 'center', fontSize: 15, marginVertical: 8, marginHorizontal: 2 }",mdxType:"Prop"},(0,l.kt)("p",null,"Custom styles for the event text. Ignored if ",(0,l.kt)("inlineCode",{parentName:"p"},"EventComponent")," is provided.")),(0,l.kt)("h3",{id:"alldayeventcontainerstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"allDayEventContainerStyle")),(0,l.kt)(u,{name:"allDayEventContainerStyle",type:"object",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"Custom styles for each all-day event container. Note: the background color and (absolute) positioning are already set.")),(0,l.kt)("h3",{id:"gridrowstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"gridRowStyle")),(0,l.kt)(u,{name:"gridRowStyle",type:"{ borderTopWidth: <width>, borderColor: <color> }",defaultValue:"{ borderTopWidth: 1, color: '#E9EDF0' }",mdxType:"Prop"},(0,l.kt)("p",null,"Prop to customize width and color of horizontal lines.")),(0,l.kt)("h3",{id:"gridcolumnstyle"},(0,l.kt)("inlineCode",{parentName:"h3"},"gridColumnStyle")),(0,l.kt)(u,{name:"gridColumnStyle",type:"{ borderLeftWidth: <width>, borderColor: <color> }",defaultValue:"{ borderLeftWidth: 1, color: '#E9EDF0' }",mdxType:"Prop"},(0,l.kt)("p",null,"Prop to customize width and color of vertical lines.")),(0,l.kt)("h3",{id:"formatdateheader"},(0,l.kt)("inlineCode",{parentName:"h3"},"formatDateHeader")),(0,l.kt)(u,{name:"formatDateHeader",type:"string",defaultValue:"'MMM D' (e.g. 'Apr 3')",mdxType:"Prop"},(0,l.kt)("p",null,"Formatter for dates in the header. See ",(0,l.kt)("a",{parentName:"p",href:"https://momentjs.com/docs/#/displaying/format/"},"all formatters in momentjs"),".")),(0,l.kt)("h3",{id:"formattimelabel"},(0,l.kt)("inlineCode",{parentName:"h3"},"formatTimeLabel")),(0,l.kt)(u,{name:"formatTimeLabel",type:"string",defaultValue:"H:mm (24h)",mdxType:"Prop"},(0,l.kt)("p",null,"Formatter for the time labels at the left. Other examples, AM/PM: ",(0,l.kt)("inlineCode",{parentName:"p"},'"h:mm A"')," or ",(0,l.kt)("inlineCode",{parentName:"p"},'"h:mm a"')," for lowercase. See ",(0,l.kt)("a",{parentName:"p",href:"https://momentjs.com/docs/#/displaying/format/"},"all formatters in momentjs"),".")),(0,l.kt)("h2",{id:"custom-components"},"Custom components"),(0,l.kt)("h3",{id:"eventcomponent"},(0,l.kt)("inlineCode",{parentName:"h3"},"EventComponent")),(0,l.kt)(u,{name:"EventComponent",type:"ReactComponent",defaultValue:"Text",mdxType:"Prop"},(0,l.kt)("p",null,"Custom component rendered inside an event. By default, is a ",(0,l.kt)("inlineCode",{parentName:"p"},"Text")," with the ",(0,l.kt)("inlineCode",{parentName:"p"},"event.description"),". See ",(0,l.kt)("a",{parentName:"p",href:"../guides/custom-components#event-content"},"custom component guide")," for an example.")),(0,l.kt)("h3",{id:"alldayeventcomponent"},(0,l.kt)("inlineCode",{parentName:"h3"},"AllDayEventComponent")),(0,l.kt)(u,{name:"AllDayEventComponent",type:"ReactComponent",defaultValue:"<Text numberOfLines={1} ellipsizeMode='tail'/>",mdxType:"Prop"},(0,l.kt)("p",null,"Custom component rendered inside an all-day event. By default, is a ",(0,l.kt)("inlineCode",{parentName:"p"},"Text")," with the ",(0,l.kt)("inlineCode",{parentName:"p"},"event.description"),".")),(0,l.kt)("h3",{id:"todayheadercomponent"},(0,l.kt)("inlineCode",{parentName:"h3"},"TodayHeaderComponent")),(0,l.kt)(u,{name:"TodayHeaderComponent",type:"ReactComponent",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"Custom component to highlight today in the header (by default, ",(0,l.kt)("em",{parentName:"p"},"today")," looks the same than every day). See ",(0,l.kt)("a",{parentName:"p",href:"../guides/custom-components#header-days"},"custom component guide")," for an example.")),(0,l.kt)("h3",{id:"dayheadercomponent"},(0,l.kt)("inlineCode",{parentName:"h3"},"DayHeaderComponent")),(0,l.kt)(u,{name:"DayHeaderComponent",type:"ReactComponent",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"Custom component to show each day in the header. If provided, overrides ",(0,l.kt)("inlineCode",{parentName:"p"},"TodayHeaderComponent"),". See ",(0,l.kt)("a",{parentName:"p",href:"../guides/custom-components#header-days"},"custom component guide")," for an example.")),(0,l.kt)("h3",{id:"refreshcomponent"},(0,l.kt)("inlineCode",{parentName:"h3"},"RefreshComponent")),(0,l.kt)(u,{name:"RefreshComponent",type:"ReactComponent",defaultValue:"ActivityIndicator",mdxType:"Prop"},(0,l.kt)("p",null,"Custom component used when ",(0,l.kt)("inlineCode",{parentName:"p"},"isRefreshing")," is ",(0,l.kt)("inlineCode",{parentName:"p"},"true"),". See ",(0,l.kt)("a",{parentName:"p",href:"../guides/custom-components#refreshing"},"custom component guide")," for an example")),(0,l.kt)("h2",{id:"day-pages-configuration"},"Day pages configuration"),(0,l.kt)("h3",{id:"pagestartat"},(0,l.kt)("inlineCode",{parentName:"h3"},"pageStartAt")),(0,l.kt)(u,{name:"pageStartAt",type:"{left: number, weekday: number}",defaultValue:"{left:0}",mdxType:"Prop"},(0,l.kt)("p",null,"Indicates what date to show in the top-left corner.\nIf ",(0,l.kt)("inlineCode",{parentName:"p"},"left: value")," provided, the ",(0,l.kt)("inlineCode",{parentName:"p"},"selectedDate")," will appear at ",(0,l.kt)("inlineCode",{parentName:"p"},"value")," days from the left. If ",(0,l.kt)("inlineCode",{parentName:"p"},"weekday: value")," ",(0,l.kt)("em",{parentName:"p"},"(e.g. tuesday = 2)")," is provided, the latest tuesday will appear in the left.")),(0,l.kt)("h3",{id:"allowscrollbyday"},(0,l.kt)("inlineCode",{parentName:"h3"},"allowScrollByDay")),(0,l.kt)(u,{name:"allowScrollByDay",type:"bool",defaultValue:"false",mdxType:"Prop"},(0,l.kt)("p",null,"When ",(0,l.kt)("inlineCode",{parentName:"p"},"true"),", the component can scroll horizontally one day at the time. When ",(0,l.kt)("inlineCode",{parentName:"p"},"false"),", the horizontal scroll can only be done one page at the time (i.e. ",(0,l.kt)("inlineCode",{parentName:"p"},"numberOfDays")," at the time).")),(0,l.kt)("h2",{id:"time-of-day-configurations"},"Time of day configurations"),(0,l.kt)("h3",{id:"starthour"},(0,l.kt)("inlineCode",{parentName:"h3"},"startHour")),(0,l.kt)(u,{name:"startHour",type:"number (hours)",defaultValue:"8 am",mdxType:"Prop"},(0,l.kt)("p",null,"  Vertical position of the week-view in the first render (vertically in the agenda).")),(0,l.kt)("h3",{id:"hoursindisplay"},(0,l.kt)("inlineCode",{parentName:"h3"},"hoursInDisplay")),(0,l.kt)(u,{name:"hoursInDisplay",type:"number (hours)",defaultValue:"6",mdxType:"Prop"},(0,l.kt)("p",null,"Amount of hours to display vertically in the agenda. Increasing this number will make the events look smaller.")),(0,l.kt)("h3",{id:"beginagendaat"},(0,l.kt)("inlineCode",{parentName:"h3"},"beginAgendaAt")),(0,l.kt)(u,{name:"beginAgendaAt",type:"number (minutes)",defaultValue:"0",mdxType:"Prop"},(0,l.kt)("p",null,"Time of day to start the agenda at the top (grid above is left out). For example, for 8 am set ",(0,l.kt)("inlineCode",{parentName:"p"},"beginAgendaAt={8*60}"),".")),(0,l.kt)("h3",{id:"endagendaat"},(0,l.kt)("inlineCode",{parentName:"h3"},"endAgendaAt")),(0,l.kt)(u,{name:"endAgendaAt",type:"number (minutes)",defaultValue:"24*60",mdxType:"Prop"},(0,l.kt)("p",null,"Time of day to end the agenda at the bottom (anything past that time is left out). For example, set ",(0,l.kt)("inlineCode",{parentName:"p"},"engAgendaAt={22*60}")," for 10pm.")),(0,l.kt)("h3",{id:"timestep"},(0,l.kt)("inlineCode",{parentName:"h3"},"timeStep")),(0,l.kt)(u,{name:"timeStep",type:"number (minutes)",defaultValue:"60",mdxType:"Prop"},(0,l.kt)("p",null,"Number of minutes to use as step in the time labels at the left. Increasing this number will increase the vertical space between grid lines.")),(0,l.kt)("h2",{id:"more-configurations"},"More configurations"),(0,l.kt)("h3",{id:"shownowline"},(0,l.kt)("inlineCode",{parentName:"h3"},"showNowLine")),(0,l.kt)(u,{name:"showNowLine",type:"boolean",defaultValue:"false",mdxType:"Prop"},(0,l.kt)("p",null,"If ",(0,l.kt)("inlineCode",{parentName:"p"},"true"),", displays a line indicating the time right now.")),(0,l.kt)("h3",{id:"nowlinecolor"},(0,l.kt)("inlineCode",{parentName:"h3"},"nowLineColor")),(0,l.kt)(u,{name:"nowLineColor",type:"string",defaultValue:"#E53935 (red)",mdxType:"Prop"},(0,l.kt)("p",null,"Color used for the now-line.")),(0,l.kt)("h3",{id:"showtitle"},(0,l.kt)("inlineCode",{parentName:"h3"},"showTitle")),(0,l.kt)(u,{name:"showTitle",type:"bool",defaultValue:"true",mdxType:"Prop"},(0,l.kt)("p",null,"Show or hide the selected month and year in the top-left corner (a.k.a the title).")),(0,l.kt)("h3",{id:"timescolumnwidth"},(0,l.kt)("inlineCode",{parentName:"h3"},"timesColumnWidth")),(0,l.kt)(u,{name:"timesColumnWidth",type:"number",defaultValue:"0.18 (18% of screen-width)",mdxType:"Prop"},(0,l.kt)("p",null,"Customize the width of the times column at the left. If the value is in range ",(0,l.kt)("inlineCode",{parentName:"p"},"0..1")," indicates a percentage of the screen width (e.g. 0.18 --\x3e 18%). Otherwise is the amount of pixels (e.g. 40 pixels).")),(0,l.kt)("h3",{id:"locale"},(0,l.kt)("inlineCode",{parentName:"h3"},"locale")),(0,l.kt)(u,{name:"locale",type:"string",defaultValue:"en",mdxType:"Prop"},(0,l.kt)("p",null,"Locale for the dates (e.g. header). There's an ",(0,l.kt)("inlineCode",{parentName:"p"},"addLocale()")," function to add your own locale, see details in the ",(0,l.kt)("a",{parentName:"p",href:"../guides/locales"},"localization guide"),".")),(0,l.kt)("h3",{id:"fixedhorizontally"},(0,l.kt)("inlineCode",{parentName:"h3"},"fixedHorizontally")),(0,l.kt)(u,{name:"fixedHorizontally",type:"boolean",defaultValue:"false",mdxType:"Prop"},(0,l.kt)("p",null,"If ",(0,l.kt)("inlineCode",{parentName:"p"},"true"),", the component cannot scroll horizontally.")),(0,l.kt)("h3",{id:"isrefreshing"},(0,l.kt)("inlineCode",{parentName:"h3"},"isRefreshing")),(0,l.kt)(u,{name:"isRefreshing",type:"boolean",defaultValue:"false",mdxType:"Prop"},(0,l.kt)("p",null,"When ",(0,l.kt)("inlineCode",{parentName:"p"},"true"),", the week-view will show an ",(0,l.kt)("inlineCode",{parentName:"p"},"<ActivityIndicator />")," in the middle of the grid.")),(0,l.kt)("h3",{id:"righttoleft"},(0,l.kt)("inlineCode",{parentName:"h3"},"rightToLeft")),(0,l.kt)(u,{name:"rightToLeft",type:"boolean",defaultValue:"false",mdxType:"Prop"},(0,l.kt)("p",null,"If ",(0,l.kt)("inlineCode",{parentName:"p"},"true"),", render older days to the right and more recent days to the left.")),(0,l.kt)("h2",{id:"press-callbacks"},"Press callbacks"),(0,l.kt)("h3",{id:"oneventpress"},(0,l.kt)("inlineCode",{parentName:"h3"},"onEventPress")),(0,l.kt)(u,{name:"onEventPress",type:"function",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when an event item is pressed, receives the event-item pressed: ",(0,l.kt)("inlineCode",{parentName:"p"},"(event) => {}"),".")),(0,l.kt)("h3",{id:"oneventlongpress"},(0,l.kt)("inlineCode",{parentName:"h3"},"onEventLongPress")),(0,l.kt)(u,{name:"onEventLongPress",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when an event item is long pressed, same signature as ",(0,l.kt)("inlineCode",{parentName:"p"},"onEventPress"),". Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(event) => {}"))),(0,l.kt)("h3",{id:"ongridclick"},(0,l.kt)("inlineCode",{parentName:"h3"},"onGridClick")),(0,l.kt)(u,{name:"onGridClick",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when the grid view is pressed. Arguments: ",(0,l.kt)("inlineCode",{parentName:"p"},"pressEvent"),": object passed by the ",(0,l.kt)("a",{parentName:"p",href:"https://docs.swmansion.com/react-native-gesture-handler/docs/api/gestures/touch-events"},"react-native-gesture-handler touch events")," (not an event item); ",(0,l.kt)("inlineCode",{parentName:"p"},"startHour"),": ",(0,l.kt)("em",{parentName:"p"},"Number"),", hour pressed; ",(0,l.kt)("inlineCode",{parentName:"p"},"date")," ",(0,l.kt)("em",{parentName:"p"},"Date"),", date object indicating day and time pressed with precision up to seconds. Note: ",(0,l.kt)("inlineCode",{parentName:"p"},"startHour")," is redundant (can be extracted from ",(0,l.kt)("inlineCode",{parentName:"p"},"date"),"), but is kept for backward-compatibility. Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(pressEvent, startHour, date) => {}"))),(0,l.kt)("h3",{id:"ongridlongpress"},(0,l.kt)("inlineCode",{parentName:"h3"},"onGridLongPress")),(0,l.kt)(u,{name:"onGridLongPress",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when the grid view is long-pressed. Same signature as ",(0,l.kt)("inlineCode",{parentName:"p"},"onGridClick")," Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(pressEvent, startHour, date) => {}"))),(0,l.kt)("h3",{id:"ondaypress"},(0,l.kt)("inlineCode",{parentName:"h3"},"onDayPress")),(0,l.kt)(u,{name:"onDayPress",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when a day from the header is pressed. Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(date, formattedDate) => {}"))),(0,l.kt)("h3",{id:"onmonthpress"},(0,l.kt)("inlineCode",{parentName:"h3"},"onMonthPress")),(0,l.kt)(u,{name:"onMonthPress",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when the month at the top left (title) is pressed. Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(date, formattedDate) => {}"))),(0,l.kt)("h2",{id:"scroll-callbacks"},"Scroll callbacks"),(0,l.kt)("h3",{id:"onswipenext"},(0,l.kt)("inlineCode",{parentName:"h3"},"onSwipeNext")),(0,l.kt)(u,{name:"onSwipeNext",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when week-view is swiped to next week/days, receives new date shown. Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(date) => {}"))),(0,l.kt)("h3",{id:"onswipeprev"},(0,l.kt)("inlineCode",{parentName:"h3"},"onSwipePrev")),(0,l.kt)(u,{name:"onSwipePrev",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when week-view is swiped to previous week/days, same signature as ",(0,l.kt)("inlineCode",{parentName:"p"},"onSwipeNext"),". Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(date) => {}"))),(0,l.kt)("h3",{id:"ontimescrolled"},(0,l.kt)("inlineCode",{parentName:"h3"},"onTimeScrolled")),(0,l.kt)(u,{name:"onTimeScrolled",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when the agenda is scrolled vertically. Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(dateWithTime) => {}"))),(0,l.kt)("h2",{id:"drag-props"},"Drag props"),(0,l.kt)("h3",{id:"ondragevent"},(0,l.kt)("inlineCode",{parentName:"h3"},"onDragEvent")),(0,l.kt)(u,{name:"onDragEvent",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Callback when an event item is dragged to another position. Arguments: ",(0,l.kt)("inlineCode",{parentName:"p"},"event"),": event-item moved, and the ",(0,l.kt)("inlineCode",{parentName:"p"},"newStartDate")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"newEndDate")," are ",(0,l.kt)("inlineCode",{parentName:"p"},"Date")," objects with day and hour of the new position (precision up to minutes). ",(0,l.kt)("strong",{parentName:"p"},"With this callback you must trigger an update on the ",(0,l.kt)("inlineCode",{parentName:"strong"},"events")," prop (i.e. update your DB), with the updated information from the event.")," Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(event, newStartDate, newEndDate) => update DB"))),(0,l.kt)("h3",{id:"drageventconfig"},(0,l.kt)("inlineCode",{parentName:"h3"},"dragEventConfig")),(0,l.kt)(u,{name:"dragEventConfig",type:"{afterLongPressDuration: milliseconds}",defaultValue:"{afterLongPressDuration: 0}",mdxType:"Prop"},(0,l.kt)("p",null,"If provided, events are only draggable after being long pressed for some time. ",(0,l.kt)("strong",{parentName:"p"},"Requires rn-gesture-handler v2.6.0 or higher.")," Disables the ",(0,l.kt)("inlineCode",{parentName:"p"},"onLongPress")," callback.")),(0,l.kt)("h2",{id:"edit-props"},"Edit props"),(0,l.kt)("h3",{id:"oneditevent"},(0,l.kt)("inlineCode",{parentName:"h3"},"onEditEvent")),(0,l.kt)(u,{name:"onEditEvent",type:"function",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"Callback when an event item is edited by dragging its borders. Signature: ",(0,l.kt)("inlineCode",{parentName:"p"},"(event, newStartDate, newEndDate) => update DB"),".")),(0,l.kt)("h3",{id:"editingevent"},(0,l.kt)("inlineCode",{parentName:"h3"},"editingEvent")),(0,l.kt)(u,{name:"editingEvent",type:"number | string",defaultValue:"null",mdxType:"Prop"},(0,l.kt)("p",null,"  Event id indicating the event currently being edited.")),(0,l.kt)("h3",{id:"editeventconfig"},(0,l.kt)("inlineCode",{parentName:"h3"},"editEventConfig")),(0,l.kt)(u,{name:"editEventConfig",type:"{ bottom: bool, top: bool, left: bool, right: bool }",defaultValue:"{ bottom: true }",mdxType:"Prop"},(0,l.kt)("p",null,"Sides allowed to be edited.")),(0,l.kt)("h2",{id:"horizontal-list-optimizations"},"Horizontal list optimizations"),(0,l.kt)("h3",{id:"windowsize"},(0,l.kt)("inlineCode",{parentName:"h3"},"windowSize")),(0,l.kt)(u,{name:"windowSize",type:"number",defaultValue:"5",mdxType:"Prop"},(0,l.kt)("p",null,"Number of pages to render at the same time. One page is composed by ",(0,l.kt)("inlineCode",{parentName:"p"},"numberOfDays")," days. See in ",(0,l.kt)("a",{parentName:"p",href:"https://reactnative.dev/docs/optimizing-flatlist-configuration#windowsize"},(0,l.kt)("em",{parentName:"a"},"optimizing FlatList docs")))),(0,l.kt)("h3",{id:"initialnumtorender"},(0,l.kt)("inlineCode",{parentName:"h3"},"initialNumToRender")),(0,l.kt)(u,{name:"initialNumToRender",type:"number",defaultValue:"5",mdxType:"Prop"},(0,l.kt)("p",null,"Initial number of pages to render. See in ",(0,l.kt)("a",{parentName:"p",href:"https://reactnative.dev/docs/optimizing-flatlist-configuration#maxtorenderperbatch"},(0,l.kt)("em",{parentName:"a"},"optimizing FlatList docs")))),(0,l.kt)("h3",{id:"maxtorenderperbatch"},(0,l.kt)("inlineCode",{parentName:"h3"},"maxToRenderPerBatch")),(0,l.kt)(u,{name:"maxToRenderPerBatch",type:"number",defaultValue:"2",mdxType:"Prop"},(0,l.kt)("p",null,"See in ",(0,l.kt)("a",{parentName:"p",href:"https://reactnative.dev/docs/optimizing-flatlist-configuration#maxtorenderperbatch"},(0,l.kt)("em",{parentName:"a"},"optimizing FlatList docs")),".")),(0,l.kt)("h3",{id:"updatecellsbatchingperiod"},(0,l.kt)("inlineCode",{parentName:"h3"},"updateCellsBatchingPeriod")),(0,l.kt)(u,{name:"updateCellsBatchingPeriod",type:"number",defaultValue:"50",mdxType:"Prop"},(0,l.kt)("p",null,"See in ",(0,l.kt)("a",{parentName:"p",href:"https://reactnative.dev/docs/optimizing-flatlist-configuration#updatecellsbatchingperiod"},(0,l.kt)("em",{parentName:"a"},"optimizing FlatList docs")))),(0,l.kt)("h2",{id:"patch-props"},"Patch props"),(0,l.kt)("h3",{id:"prependmostrecent"},(0,l.kt)("inlineCode",{parentName:"h3"},"prependMostRecent")),(0,l.kt)(u,{name:"prependMostRecent",type:"bool",defaultValue:"false",mdxType:"Prop"},(0,l.kt)("p",null,"If ",(0,l.kt)("inlineCode",{parentName:"p"},"true"),", the horizontal prepending is done in the most recent dates when scrolling. See ",(0,l.kt)("a",{parentName:"p",href:"../troubleshoot#glitch-when-swiping-to-new-pages"},"known issues"),".")),(0,l.kt)("h3",{id:"runonjs"},(0,l.kt)("inlineCode",{parentName:"h3"},"runOnJS")),(0,l.kt)(u,{name:"runOnJS",type:"bool",defaultValue:"false",mdxType:"Prop"},(0,l.kt)("p",null,"Passed to react-native-gesture-handler. Might be needed to prevent an ANR bug in android, see details in ","[this issue]","(",(0,l.kt)("a",{parentName:"p",href:"https://github.com/hoangnm/react-native-week-view/issues/259"},"this issue"),")")))}C.isMDXComponent=!0}}]);