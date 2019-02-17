# Contributing

### Commit Message Guidelines

The commit message is used to both inform the reader and automate the release process using semantic-release. To this end, we follow the [Conventional Commits](https://conventionalcommits.org/#conventional-commits-specification) specification.

#### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```text
<type>[(scope)]: <description>

[body]

[footer]
```

#### Examples

##### Feature Commit Message Example

```text
feat(ArrayDataSource): add 'push' method

Add the ability to append, or "push", an entry onto the end of the internal data.
```

##### Breaking Change Commit Message Example

```text
perf(PagerProcessor): reduce page generation load

The .page property was taking considerable processing to regenerate it's caches.
To increase performance, the .page property will no longer reprocess said cache.

BREAKING CHANGE:

Setting the .page property will no longer reprocess the entire attached DataSource
```

#### Type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code \(white-space, formatting, missing semi-colons, etc\)
* **test**: Adding missing tests or correcting existing tests
* **config**: Changes to our configuration files and scripts \(Git, Travis CI, etc.\)
* **docs**: Documentation only changes

**Scope**

The scope must:

* be a single word noun
* be surrounded with parentheses
* use the name of the class/utility that was altered in the change



