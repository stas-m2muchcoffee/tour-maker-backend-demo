import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteDescriptionFromTourStop1763112431353
  implements MigrationInterface
{
  name = 'DeleteDescriptionFromTourStop1763112431353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour_stop" DROP COLUMN "description"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour_stop"
            ADD "description" text
        `);
  }
}
