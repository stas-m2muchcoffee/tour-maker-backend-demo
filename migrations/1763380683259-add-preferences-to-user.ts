import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPreferencesToUser1763380683259 implements MigrationInterface {
  name = 'AddPreferencesToUser1763380683259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "preferences" text array
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "embedding" vector
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "embedding"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "preferences"
        `);
  }
}
