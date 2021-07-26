# Report

This is a report on the Task, To adding a feature in post module to allo the user add an imag/picture in their post.

Before moving towards the task, I choose the working stack which was suggested in the task description React.js for frontend and Node.js for Backend. Selection of stack was done using `yarn cli choosestack`.

## Structuring the Task
The task was divided into 3 sections

* [Understanding the existing code](#understanding-the-existing-code)
* [Implementing the image upload and preview mechanism](#implementing-the-image-upload-and-preview-mechanism)
* [Updating Graphql Queries and Mutation and Handling the schema related changes](#updating-grahql-queries-and-mutation-and-handling-the-schema-related-changes)

## Understanding the existing code
Maintaining and Understanding the existing code is important to add any new features to current modules. Following current code increases readability of the code and maintainablity.

## Implementing the image upload and preview mechanism
Next Part was to add the the feature to allow user, upload image/picture and preview before updating and submiting the post in the client side of the project. Semantic UI was used for the UI Components. For enabling the use of Semantic UI Components required dependencies were added and Semantic css `import 'semantic-ui-css/semantic.min.css'` file was imported in index.js. Upload mechanism was implemented using input tag which has input type `file`. For better UI/UX experience external button was used to trigger upload by giving ref to input tag and accessing `inputRef.current,click()` method. Uploaded file was made preview ready using fileReader API of javascript to convert it into binary file which was used by Image Tag to display the preview. Before submitting the post, the image is upladed to external cloud system for storing it and getting is access URL. The Upload was done using POST method to the Clound.

## Updating Graphql Queries and Mutation and Handling the schema related changes
This part of the code changes are straight forward. The schema for the post was updated to add `pic` field as string type. Following it all the queries and mutation were updated to accomodate following changes. Finally Knex migrations were updated which is used to update database and new entries.

## Time Taken
Each section was completed in average of two hours following with the testing after completing each section. Overall Task was completed in 7 Hours including Planning, execution and Testing over Two days. The changes are pushed in a single commit with lable 'Task Complete'.

## Conclusion
At last the feature was added to uplaod image/picture to the post also allowing User to edit the picture also.