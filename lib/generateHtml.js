const fs = require ("fs");
const path = require ("path");
const util = require ("util");
const inquirer = require("inquirer");
const Engineer = require("./engineer");
const Intern = require("./intern");
const Manager = require("./manager");
// const render = require("./generateHtml");

const templateDir = path.resolve(__dirname,"../templates")
const buildDir = path.resolve(__dirname, "../build/") 
const teamMembers = [
       new Manager("Manny", 1, "manny@heiscool.com", 200),
      new Engineer("Chaz", 2, "chaz@heiscool.com", "viachaz"),
      new Intern("vas", 3, "vas@heiscool.com", "UofA"),
      new Intern("Caleb", 4, "caleb@heiscool.com", "ASU")
    ];
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

async function render(employer){
    const html = []

 

    const [
        managerTemplate,
        engineerTemplate,
        internTemplate,
        mainTemplate,
    ]= await Promise.all([
        readFile(path.resolve(templateDir,"manager.html"),"utf8"),
        readFile(path.resolve(templateDir,"engineer.html"),"utf8"),
        readFile(path.resolve(templateDir,"intern.html"),"utf8"),
        readFile(path.resolve(templateDir,"main.html"),"utf8"),
    ])
   
    html.push(
        employer
         .filter((employee )=> employee.getRole() == 'Manager')
          .map(employee => {
              
            let template = managerTemplate;
            for (const key in employee) {
              template = replacePlaceholder(template, key, employee[key]);
            }
             
            return template;
          })
          .join("")
      );
      
      html.push(
        employer
          .filter(employee => employee.getRole()  ==  'Engineer')
          .map(employee => {
            let template = engineerTemplate;
            for (const key in employee) {
              template = replacePlaceholder(template, key, employee[key]);
            }
            return template;
          })
          .join("")
      );

      html.push(
        employer
          .filter(employee => employee.getRole()  ==  'Intern')
          .map(employee => {
            let template = internTemplate;
            for (const key in employee) {
              template = replacePlaceholder(template, key, employee[key]);
            }
            return template;
          })
          .join("")
      );
 
 
    //console.log (managerTemplate)
    await writeFile (   path.resolve(buildDir,"index.html"),replacePlaceholder(mainTemplate,"body",html))

}

//permet d'injecter les variables dans le html
 
function replacePlaceholder(template, target, value) {
    const regex = new RegExp("{{ " + target + " }}", "gm");
    const newTemplate = template.replace(regex, value);
    return newTemplate;
  }
 


//render(employer)
module.exports = render

