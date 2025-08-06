Steps to implement swagger:

1. Install two Packages - swagger-ui-express and swagger-autogen
2. Open documentation (npm swagger-ui-express) and copy the code and paste to import swagger-ui-express and swagger-output.json
3. Now create a file(swagger.js) then, open the documentation(npm swagger-autogen)
4. After open the documentation click on the (Please refer to the documentation website on https://swagger-autogen.github.io.)
5. Now click on the Quick start and copy the code from there and paste in the swagger.js file.
6. In the package.json file create a script generate doc then run the script, after run the script successfully it the swagger-output.json file creates with the documentation of the apis.
7. Run the server and at the browser "http://localhost:5000/api-docs
8. Here you see all the apis are documented and ready to execute from there.