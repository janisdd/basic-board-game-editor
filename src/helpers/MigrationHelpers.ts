import {ExportTile, ExportWorld, Tile} from "../types/world";
import {Logger} from "./logger";
import {FieldSymbol} from "../types/drawing";
import {appProperties} from "../constants";


interface MigrationClass {

  /**
   * the old version
   */
  oldVersion: string
  /**
   * the new version we update the tiles/world to
   */
  newVersion: string

  /**
   * changes the tile to match the new version
   *
   * this must create a new tile (no reference)
   * @param {ExportTile} exportTile
   * @returns {ExportTile}
   */
  migrateTile(exportTile: ExportTile): ExportTile

  /**
   * changes the world to match the new version
   *
   * this must create a new world (no reference)
   * @param {ExportWorld} exportWorld
   * @returns {ExportWorld}
   */
  migrateWorld(exportWorld: ExportWorld): ExportWorld
}

/**
 * migration for version 1.0.0 to 1.0.1
 *
 * added props
 *  ImgBase.isMouseDisabled
 */
class Migration_1_0_0__to__1_0_1 implements MigrationClass {

  oldVersion = '1.0.0'
  newVersion = '1.0.1'


  public migrateTile(exportTile: ExportTile): ExportTile {

    const copy: ExportTile = {
      ...exportTile,
      editorVersion: this.newVersion,
      tile: {
        ...exportTile.tile,
        imgShapes: exportTile.tile.imgShapes.map((value, index) => {
          return {
            ...value,
            isMouseDisabled: false
          }
        })
      },
      imgSymbols: exportTile.imgSymbols.map((value, index) => {
        return {
          ...value,
          isMouseDisabled: false
        }
      }),
    }
    return copy
  }

  public migrateWorld(exportWorld: ExportWorld): ExportWorld {

    const copy: ExportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,
      imgSymbols: exportWorld.imgSymbols.map((value, index) => {
        return {
          ...value,
          isMouseDisabled: false
        }
      }),
      allTiles: exportWorld.allTiles.map((tile) => {
        return {
          ...tile,
          imgShapes: tile.imgShapes.map((value, index) => {
            return {
              ...value,
              isMouseDisabled: false
            }
          })
        }
      })
    }

    return copy
  }

}

/**
 * migration for version 1.0.1 to 1.0.2
 *
 * added props
 *  FieldBase.imgGuid
 */
class Migration_1_0_1__to__1_0_2 implements MigrationClass {

  oldVersion = '1.0.1'
  newVersion = '1.0.2'

  public migrateTile(exportTile: ExportTile): ExportTile {

    const copy: ExportTile = {
      ...exportTile,
      editorVersion: this.newVersion,
      tile: {
        ...exportTile.tile,
        fieldShapes: exportTile.tile.fieldShapes.map((value, index) => {
          return {
            ...value,
            backgroundImgGuid: null
          }
        })
      },
      fieldSymbols: exportTile.fieldSymbols.map((value, index) => {
        return {
          ...value,
          backgroundImgGuid: null
        }
      }),
    }
    return copy
  }

  public migrateWorld(exportWorld: ExportWorld): ExportWorld {

    const copy: ExportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,
      fieldSymbols: exportWorld.fieldSymbols.map((value, index) => {
        return {
          ...value,
          backgroundImgGuid: null
        }
      }),
      allTiles: exportWorld.allTiles.map((tile) => {
        return {
          ...tile,
          fieldShapes: tile.fieldShapes.map((value, index) => {
            return {
              ...value,
              backgroundImgGuid: null
            }
          })
        }
      })
    }

    return copy
  }

}


/**
 * a helper to create a shallow migration (no field/img/line props are changed, model) only ui stuff
 * @param {string} oldVersion
 * @param {string} newVersion
 * @returns {MigrationClass}
 */
function createVersionShallowMigration(oldVersion: string, newVersion: string): MigrationClass {
  return {
    oldVersion,
    newVersion,
    migrateTile: exportTile => {
      return {
        ...exportTile,
        editorVersion: newVersion
      }
    },
    migrateWorld: exportWorld => {
      return {
        ...exportWorld,
        editorVersion: newVersion
      }
    }
  }
}

export class MigrationHelper {
  private constructor() {
  }

  public static readonly versionsToSkip: string[] = []

  /**
   * make sure this is in sync with the version in
   * @see appProperties.version
   * @type {Migration_1_0_0__to__1_0_1[]}
   */
  public static readonly allMigrations: ReadonlyArray<MigrationClass> = [
    new Migration_1_0_0__to__1_0_1(),
    new Migration_1_0_1__to__1_0_2(),
    createVersionShallowMigration('1.0.2', '1.0.3')
  ]

  /**
   * applies all pending migrations to the tile
   * the returned tile version is the latest version
   *
   * a new obj is created
   * @param {ExportTile} exportTile
   * @returns {ExportTile | null} null on any error
   */
  public static applyMigrationsToTile(exportTile: ExportTile): ExportTile | null {

    for (let i = 0; i < this.allMigrations.length; i++) {
      const migration = this.allMigrations[i]

      if (migration.oldVersion === exportTile.editorVersion) {
        try {
          exportTile = migration.migrateTile(exportTile)
          Logger.log(`migrated export tile from version ${migration.oldVersion} to ${migration.newVersion}`)
        } catch (err) {
          Logger.fatal(`migrating export tile failed from version ${migration.oldVersion} to ${migration.newVersion}`)
          return null
        }
      }
      else {


      }
    }


    if (exportTile.editorVersion !== appProperties.version) {
      Logger.fatal(`we missed some migrations... up migrated version is ${exportTile.editorVersion} editor version is ${appProperties.version}`)
    }

    return exportTile
  }

  /**
   * applies all pending migrations to the tile
   * the returned tile version is the latest version
   *
   * a new obj is created
   * @param {ExportWorld} exportWorld
   * @returns {ExportWorld | null} null on any error
   */
  public static applyMigrationsToWorld(exportWorld: ExportWorld): ExportWorld | null {

    for (let i = 0; i < this.allMigrations.length; i++) {
      const migration = this.allMigrations[i]

      if (migration.oldVersion === exportWorld.editorVersion) {

        try {
          exportWorld = migration.migrateWorld(exportWorld)
          Logger.log(`migrated export world from version ${migration.oldVersion} to ${migration.newVersion}`)
        } catch (err) {
          Logger.fatal(`migrating export world failed from version ${migration.oldVersion} to ${migration.newVersion}`)
          return null
        }
      }
    }

    if (exportWorld.editorVersion !== appProperties.version) {
      Logger.fatal(`we missed some migrations... up migrated version is ${exportWorld.editorVersion} editor version is ${appProperties.version}`)
    }

    return exportWorld
  }

}