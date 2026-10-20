import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',testMatch:'design-v2.spec.ts',timeout:180000,workers:1,use:{baseURL:'http://localhost:4191',headless:true,screenshot:'only-on-failure'},projects:[
 {name:'chrome-320',use:{browserName:'chromium',channel:'chrome',viewport:{width:320,height:568},launchOptions:{args:['--mute-audio']}}},
 {name:'chrome-390',use:{browserName:'chromium',channel:'chrome',viewport:{width:390,height:844},launchOptions:{args:['--mute-audio']}}},
 {name:'chrome-desktop',use:{browserName:'chromium',channel:'chrome',viewport:{width:1280,height:800},launchOptions:{args:['--mute-audio']}}},
 {name:'webkit-390',use:{browserName:'webkit',viewport:{width:390,height:844}}},
],webServer:{command:'npm run preview -- --host localhost --port 4191 --strictPort',url:'http://localhost:4191',reuseExistingServer:false}});
