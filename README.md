
# 1DL201 Project (Group 9)

This project is for the course 1DL201 in which we were tasked to create a TypeScript project.

We decided to create a Path finding comparisson using Mazes and difrent graph traversal algorithms over a given ListGraph.

Display is handeled på the Pixi.js package.

## Contributing

To contribute you need to check the [milestones](https://github.com/hato1883/1DL201-Project-Group-9/milestones) tab on the issue page.

Pick a milestone and then one of its issues (remeber to assign the issue to yourself).

To contribute your changes:  
- Make a new branch with the name:  
  `feature-{issue-number}/{short-description}`.  
  *(replace {issue-number} and {short-description}, Example: feature-2/add-readme)*.

- Open [pull requests](https://github.com/hato1883/1DL201-Project-Group-9/pulls).

- Recive code review from the 2 other people in the project

- Complete the pull request in to development

**NOTE:**  
*Before opening a pull request make sure you merge any new changes made to the development branch into your branch.  
Making sure to resolve any conflict (If everything is done correctly the created feature branch will be small and most likely avoid any conflicts).*

To open a pull request simply go to [pull requests](https://github.com/hato1883/1DL201-Project-Group-9/pulls) tab and press "New pull request" selecting development as the "base" branch and your newly created branch as the "compare" branch.


## Installation

To install teh project make sure to clone repositroy development branch, then run the following:

```bash
  npm i
```
and then run this if you are on mac or linux based machines
```bash
  cp scripts/pre-commit .git/hooks/ && chmod +x .git/hooks/pre-commit
```
or this if you are on windows:
```bash
  cp scripts/pre-commit .git/hooks/; attrib +x .git/hooks/pre-commit
```
    
## Running the code

in vscode select the "Run and Debug" tab, then select the "complete development" configuration.  

This will open a clean chrome instance with the adress localhost:8080 typed in. It will also start the webpack plugin that will host our application for local testing.

When webpack has completed it's setup the browser should now display our pixi.js display.
    
## Running Tests

To run tests, run the following command:

```bash
  jest
```
and to check linting of all files run:
```bash
  npm lint
```

