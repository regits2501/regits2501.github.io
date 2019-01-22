angular.module('Portfolio.Home')
 .factory('ShowProjectService', function(){
        
     function showProject(side, main, mainScope){
                          // side , sides      , pickedProject

         // pick sphere and projectview to animate
         // t1 - when project is chosen (hide corona from sphere)
         //      add chosen project corona
         // t1 -same time dim the project view (chenge color/ shadow of border to mach chosen project color)
         //     show the project view
        let outerSphere   = angular.element(document.querySelector('.project-sphere-outer'));
        let projectView   = angular.element(document.querySelector('.project-view'));
        let pickedOnLine  = angular.element(document.querySelector('.pick-'+ side.name)); // Text near sphere 

                         
        let previousProject = main.pickedProject;
        let project = side.name;
        let delay = 200; // 200 ms

        function showProject (async){
          
           main.pickedProject = side;                   // update model
           if(async) mainScope.$apply();                // triggers digest cycle only for main scope 

           outerSphere.removeClass('hide-corona'); 
           outerSphere.addClass(project + '-corona')   // t2 add this project corona
           
           projectView.addClass(project + '-border')    //  t2 add project border color / shadow
           projectView.removeClass('hide-view')         //  t2 show the projec-view 
 
           pickOnLine();
        }

        function hideProject (){                        // t1
           outerSphere.addClass('hide-corona');         // project was picked previously, hide its corona
           projectView.addClass('hide-view');           // hide the view
          
        }
     
        function clean(){                               // remove classes that we added on last click/pick
           outerSphere.removeClass(previousProject.name + '-corona');
           projectView.removeClass(previousProject.name + '-border');
        } 



        function pickOnLine (){
           if(main.previousPickedOnLine) 
               if(main.previousPickedOnLine !== pickedOnLine) 
                  main.previousPickedOnLine.removeClass(previousProject.name + '-on-line')
          
           pickedOnLine.addClass(project + '-on-line');
           main.previousPickedOnLine = pickedOnLine;            
        }

        if(previousProject){           // a project was picked previously

           hideProject();           // hide corona and project view

           setTimeout(function(){  // show projects corona, add its border and show the project
              clean();
              showProject(true);
           }, delay)
           
        }
        else showProject();       // first pick, just add its corona, add border and show project

             
     }

     return showProject
 })
