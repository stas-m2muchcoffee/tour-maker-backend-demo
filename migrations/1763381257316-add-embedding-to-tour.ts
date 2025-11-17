import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmbeddingToTour1763381257316 implements MigrationInterface {
  name = 'AddEmbeddingToUser1763381257316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD "embedding" vector
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour" DROP COLUMN "embedding"
        `);
  }
}
