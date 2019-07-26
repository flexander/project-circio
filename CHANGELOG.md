# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [develop]
### Changed
- Replaces webpack
- Implements sass
- Allows scaling down a large canvas

## [1.1.0]
### Added

- Adds four circle blueprint
- Adds brush size control
- Adds modulo attribute to circles
- Adds loading by index
- Adds modulo controls

## [1.0.0]
### Added

- Imports painter settings on storage import
- Adds blueprint module

### Changed

- Moves control re-rendering to the import function
- Data is no longer encoded before being stored in local data
- Default background colour has changes to a blueprint blue 
- The encode parameter in export functions defaults to false 

### Fixed

- Fixes bug when clearing canvas with the linked brush flag set to true

## [0.2.0]
### Added

- Adds the ability to store configurations to local storage

### Changed

- Implements mathjs throughout most calculations

## [0.1.0] - 2019-05-16
### Changed

- All circio module repos have been combined into the project circio repo
