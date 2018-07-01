# Incrementing the version

there are different places where we need to update the version *string*

you should at least increment the version if the model (field/img/line) shapes/symbols got new properties (or if some got removed)

- `package.json > version` this is only *visually* and has no effect on the real app
- `src/constants.ts > appProperties > version`
- `src/helpers/MigrationHelpers.ts`

in `src/helpers/MigrationHelpers.ts` you need to add a new class following the pattern

```ts
class Migration_before__to__after implements MigrationClass {

}
```

implement the class (the functions are used to update the tiles & worlds that will be imported)

**make sure that the functions set the tile & world version number to the newVersion!**

then add the an instance of the new class to

`MigrationHelper > allMigrations`

make sure that the latest migration class is the last one

everything else is handled by the `MigrationHelper` class


- basically after every import (tile or world) we check if there are still some migrations pending for the tile/world
	- if yes, we apply the migration (which increments the version) and do the same for the next migration in `allMigrations`
	- if not skip this migration and goto the next migration in `allMigrations`


after all migrations are checked the tile/world version must match the app version (in `src/constants.ts`)


because of this even if we don't changed the shapes/symbol properties and we want to increment the version we need to add a new migration class
in this case the migration functions would be simple as

```ts
class Migration_before__to__after implements MigrationClass {
  oldVersion = 'beforeVersion'
  newVersion = 'afterVersion'

	 public migrateTile(exportTile: ExportTile): ExportTile {
		return {
			...exportTile,
			editorVersion: this.newVersion
		}
	 }

	 public migrateWorld(exportWorld: ExportWorld): ExportWorld {
		 return {
			 ...exportWorld,
			 editorVersion: this.newVersion
		 }
	 }
}
```

**do we need to create a new class for every version increment even if we didn't change the shape/symbol props more than 1 time in a row?**

yes but there is a helper function `createVersionShallowMigration`

which can be used to create a new migration that only increments the tile/world version

usage:

```ts
  public static readonly allMigrations: ReadonlyArray<MigrationClass> = [
    new Migration_1_0_0__to__1_0_1(),
    new Migration_1_0_1__to__1_0_2(),
    createVersionShallowMigration('1.0.2', '1.0.3')
  ]
```

**this could definitely be improved...**

yes! but i hope there are not so many version increments ;D
