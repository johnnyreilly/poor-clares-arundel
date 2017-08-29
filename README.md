# Poor Clares Arundel [![Build Status](https://ci.appveyor.com/api/projects/status/github/johnnyreilly/poor-clares-arundel?svg=true)](https://ci.appveyor.com/project/JohnReilly/poor-clares-arundel)

The Poor Clares of Arundel's website - the source of: http://www.poorclaresarundel.org/

To my knowledge this is the first Convent with Continuous Deployment.

Built on Angular 1.x and ASP.Net Core.

## Developing

To run locally you need to run both the asp.net core project and the webpack watch project.

```shell
cd .\src\poor-clares-arundel

# in one shell
dotnet run

# in another shell
npm run watch
```

Then you can browse to http://localhost:5000

## Licence

Copyright © 2014 [John Reilly](twitter.com/johnny_reilly). This project is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).