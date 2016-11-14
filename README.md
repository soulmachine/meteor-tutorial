# meteor-tutorial

Meteor 入门教程。

Table of Contents
-----------------
1. [Step1: 新建一个工程](#step1-新建一个工程)


# Step1: 新建一个工程

现在 github 网页上新建一个 private 项目 `princessmap`，然后 clone 到本地

    git@github.com:soulmachine/meteor-tutorial.git
    mv meteor-tutorial tmp-meteor-tutorial

    meteor create meteor-tutorial
    mv tmp-meteor-tutorial/* meteor-tutorial/
    mv tmp-meteor-tutorial/.git/ meteor-tutorial/
    mv tmp-meteor-tutorial/.gitignore meteor-tutorial/
    rm -rf tmp-meteor-tutorial
    cd meteor-tutorial
    meteor npm install
    meteor

    git config user.name soulmachine
    git config user.email soulmachine@gmail.com
    git config github.user soulmachine
    git add *
    git add .meteor/
    git commit -m "Step1: 新建一个工程"
    git push origin master

