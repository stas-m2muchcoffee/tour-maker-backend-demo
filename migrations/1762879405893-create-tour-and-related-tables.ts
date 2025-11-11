import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTourAndRelatedTables1762879405893
  implements MigrationInterface
{
  name = 'CreateTourAndRelatedTables1762879405893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "city" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "category" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "tour" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "cityId" uuid,
                "categoryId" uuid,
                CONSTRAINT "PK_972cd7fa4ec39286068130fa3f7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "tour_stop" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "name" character varying NOT NULL,
                "location" json NOT NULL,
                "description" text NOT NULL,
                "tourId" uuid,
                CONSTRAINT "PK_fdbc7227447d5fbc50ae77936a3" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD CONSTRAINT "FK_b52e187c6cb3944c1cd3c0fc637" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tour"
            ADD CONSTRAINT "FK_f8ca29b2c218abd8aa1e0e1c4da" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tour_stop"
            ADD CONSTRAINT "FK_c40c98d527e16a07cb3fd2d6d1c" FOREIGN KEY ("tourId") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tour_stop" DROP CONSTRAINT "FK_c40c98d527e16a07cb3fd2d6d1c"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP CONSTRAINT "FK_f8ca29b2c218abd8aa1e0e1c4da"
        `);
    await queryRunner.query(`
            ALTER TABLE "tour" DROP CONSTRAINT "FK_b52e187c6cb3944c1cd3c0fc637"
        `);
    await queryRunner.query(`
            DROP TABLE "tour_stop"
        `);
    await queryRunner.query(`
            DROP TABLE "tour"
        `);
    await queryRunner.query(`
            DROP TABLE "category"
        `);
    await queryRunner.query(`
            DROP TABLE "city"
        `);
  }
}
