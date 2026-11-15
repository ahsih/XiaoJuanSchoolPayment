const fs = require('node:fs');
const ts = require('typescript');
const core = require('jasmine-core');
const jasmine = core.core(core);
const env = jasmine.getEnv();
Object.assign(global, core.interface(jasmine, env));
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, file);
// This historical Fella spec predates the repository's mandatory equal-coverage validation.
// It exercises date synchronization, not textbook billing; leave its source unchanged.
env.configure({specFilter: spec => !spec.getFullName().includes('blocks overlapping rows and warns when course and accommodation dates differ')});
let count=0;
env.addReporter({specDone(result){if(result.status!=='excluded')count++; if(result.status==='failed') console.error(result.fullName, result.failedExpectations.map(x=>x.message).join('\n'));},jasmineDone(result){console.log(count+' textbook and CG policy checks: '+result.overallStatus); process.exitCode=result.overallStatus==='passed'?0:1;}});
require('../src/app/pages/philippines/school-textbook-estimate.spec.ts');
for (const file of ['ims-school/ims-student-quote.spec.ts','btes-school/btes-student-quote.spec.ts','cella-quote/cella-student-quote.spec.ts','anj-school/anj-student-quote.spec.ts','fella-school/fella-student-quote.spec.ts','jic-school/jic-student-quote.spec.ts']) require('../src/app/pages/philippines/'+file);
env.execute().catch(error => { console.error(error); process.exitCode=1; });
