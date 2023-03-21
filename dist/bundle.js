!function o(i,a,s){function r(t,e){if(!a[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(d)return d(t,!0);throw(e=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",e}n=a[t]={exports:{}},i[t][0].call(n.exports,function(e){return r(i[t][1][e]||e)},n,n.exports,o,i,a,s)}return a[t].exports}for(var d="function"==typeof require&&require,e=0;e<s.length;e++)r(s[e]);return r}({1:[function(e,t,a){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(a,"__esModule",{value:!0}),a.listenerToken=void 0;const s=e("./scripts/constants"),r=e("./scripts/util/DirectionalAmbientSound"),d=n(e("./scripts/util/Logger")),u=s.RELEASE,l={};function i(){if(game instanceof Game&&!game.audio.locked&&a.listenerToken){var e,t,n=game.canvas.sounds.placeables,o=new Date;for(const i of n)i.isAudible?i.sound.context?(l[i.id]||(l[i.id]=new r.DirectionalAmbientSound(i),l[i.id].connect()),l[i.id].lastUpdate=o):d.default.log(d.default.Medium,"No Audio Context, waiting for user interaction"):d.default.log(d.default.Medium,"Sound not Audible for (probably is just turned off)");for([e,t]of Object.entries(l))t.lastUpdate!=o?(t.disconnect(),delete l[e]):t.listenerUpdateHandler(a.listenerToken);u==s.DEVEL&&((n=document.querySelector(".tds-listeners"))?n.innerHTML=""+Object.entries(l).length:d.default.log(d.default.Medium,".tds-listeners not found"))}}Hooks.on("init",function(){d.default.init(s.APP_NAME,u.threshold),u==s.DEVEL&&(CONFIG.debug.hooks=!0),d.default.log(d.default.High,`Version ${s.VERSION} is initialized (${u.name} target)`)}),Hooks.on("ready",async function(){var e;d.default.log(d.default.Low,"ready"),game instanceof Game&&(await game.audio.awaitFirstGesture(),e=getActingToken({warn:!1}))&&(a.listenerToken=e,d.default.log(d.default.Low,"Token obtained, id: "+a.listenerToken.id),i())}),Hooks.on("updateScene",function(e,t,n){game instanceof Game&&(d.default.log(d.default.Low,"A scene was updated"),game.scenes.viewed.id==t._id)&&d.default.log(d.default.High,"Received viewed scene update")}),Hooks.on("updateToken",function(e,t,n,o){d.default.log(d.default.Low,"updateToken called"),a.listenerToken&&i()}),Hooks.on("updateAmbientSound",function(e,t,n,o){d.default.log(d.default.Low,"updateAmbientSound called"),a.listenerToken&&i()}),Hooks.on("controlToken",async function(e,t){game instanceof Game&&(d.default.log(d.default.Low,"controlToken called"),t?(d.default.log(d.default.Low,"No token selected but getting from user"),a.listenerToken=getActingToken({actor:game.user.character,warn:!1})):(d.default.log(d.default.Low,"Token Selected so it should be yours"),a.listenerToken=e),a.listenerToken?(d.default.log(d.default.Low,"Token obtained, id: ",a.listenerToken.id),d.default.log(d.default.Low,"Got a Token, Doing the Sterio"),await game.audio.awaitFirstGesture(),i()):d.default.log(d.default.Low,"Looks like you are the GM"))}),Hooks.on("renderPlayerList",function(e,t){u==s.DEVEL&&game instanceof Game&&t.find(`[data-user-id="${game.userId}"]`).append("<div><p>TDS Count: </p><b class='tds-listeners'></b></div>")}),Hooks.once("devModeReady",function({registerPackageDebugFlag:e}){e("benettest")})},{"./scripts/constants":2,"./scripts/util/DirectionalAmbientSound":5,"./scripts/util/Logger":7}],2:[function(e,t,n){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},o=(Object.defineProperty(n,"__esModule",{value:!0}),n.DEVEL=n.RELEASE=n.VERSION=n.APP_NAME=void 0,o(e("./util/Logger")));n.APP_NAME="token-based-directional-sound",n.VERSION="0.0.1-alpha",n.RELEASE={threshold:o.default.High,name:"Release"},n.DEVEL={threshold:o.default.Low,name:"Devel"}},{"./util/Logger":7}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.DirectionalAmbientSoundStates=void 0,(n=n.DirectionalAmbientSoundStates||(n.DirectionalAmbientSoundStates={}))[n.DISCONNECTED=0]="DISCONNECTED",n[n.CONNECTED=1]="CONNECTED"},{}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.AmbientSoundListenedUnconnectedError=void 0;class o extends Error{constructor(){super("AmbientSound placeable got directionality update while sterio was disabled")}}n.AmbientSoundListenedUnconnectedError=o},{}],5:[function(e,t,n){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0}),n.DirectionalAmbientSound=void 0;const i=e("../errors/DirectionalAmbientSoundStates"),s=e("./AmbientSoundListenedUnconnectedError"),r=o(e("./Logger"));n.DirectionalAmbientSound=class{constructor(e){this.ambientSound=e,this.state=i.DirectionalAmbientSoundStates.DISCONNECTED,this.lastUpdate=new Date;e=this.ambientSound.sound,this.container=e.container,this.gainNode=this.container.gainNode,e=this.container.context;this.source=this.container.sourceNode,this.gainNodeL=e.createGain(),this.gainNodeR=e.createGain(),this.merger=e.createChannelMerger(2),this.gainNodeL.connect(this.merger,0,0),this.gainNodeR.connect(this.merger,0,1)}get connected(){return this.state===i.DirectionalAmbientSoundStates.CONNECTED}connect(){this.source.connect(this.gainNodeL),this.source.connect(this.gainNodeR),this.merger.connect(this.container.context.destination),this.state=i.DirectionalAmbientSoundStates.CONNECTED}disconnect(){this.gainNode.disconnect(this.gainNodeL),this.gainNode.disconnect(this.gainNodeR),this.merger.disconnect(this.container.context.destination),this.state=i.DirectionalAmbientSoundStates.DISCONNECTED}listenerUpdateHandler(e){if(!this.connected)throw new s.AmbientSoundListenedUnconnectedError;var t=e.clone(),n=new PIXI.Graphics,o=new PIXI.Graphics,t=(t.addChild(n),n.position.set(0,t.center.y),t.addChild(o),o.position.set(t.width,t.center.y),canvas.grid.measureDistance(e.center,n)),n=canvas.grid.measureDistance(e.center,o),o=e["width"],e=t-n,i=(o-e)/2-(o-1),o=(o+e)/2-(o-1),a=this.container.context;this.gainNodeL.gain.setValueAtTime(i,a.currentTime),this.gainNodeR.gain.setValueAtTime(o,a.currentTime),r.default.log(r.default.Low,`[Sound Updated ${this.ambientSound.id}] L: ${i} | R: ${o} \\ Delta L: ${t} | Delta R: ${n} | Delta W: `+e)}}},{"../errors/DirectionalAmbientSoundStates":3,"./AmbientSoundListenedUnconnectedError":4,"./Logger":7}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.LogLevel=void 0;n.LogLevel=class{constructor(e,t){this._name="",this._value=0,this._name=e,this._value=t}get name(){return this._name}get value(){return this._value}}},{}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});e=e("./LogLevel");class o{static init(e,t){o.moduleName=e,o.threshold=t,this.log(t,"Set log threshold to "+t.name)}static log(e,...t){o.threshold.value<=e.value&&console.log(`[${this.moduleName}]: `,...t)}}(n.default=o).Low=new e.LogLevel("low",1),o.Medium=new e.LogLevel("medium",2),o.High=new e.LogLevel("high",3),o.None=new e.LogLevel("none",1/0),o.moduleName="Unnamed Module",o.threshold=o.None},{"./LogLevel":6}]},{},[1]);
//# sourceMappingURL=bundle.js.map