import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAndRouteFieldsToTourAndMakeTourStopDescriptionOptional1762949010799
  implements MigrationInterface
{
  name =
    'AddUserAndRouteFieldsToTourAndMakeTourStopDescriptionOptional1762949010799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD "route" json NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD "userId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "tour_stop"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD CONSTRAINT "FK_d305ffb20137507c3ac63e128e4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour" DROP CONSTRAINT "FK_d305ffb20137507c3ac63e128e4"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour_stop"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP COLUMN "userId"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP COLUMN "route"
        `);
  }
}
