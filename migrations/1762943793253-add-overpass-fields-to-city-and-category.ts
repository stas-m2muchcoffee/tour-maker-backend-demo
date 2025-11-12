import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOverpassFieldsToCityAndCategory1762943793253 implements MigrationInterface {
    name = 'AddOverpassFieldsToCityAndCategory1762943793253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "city"
            ADD "countryName" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "city"
            ADD "overpassId" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "overpassCategories" text array NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "overpassCategories"
        `);
        await queryRunner.query(`
            ALTER TABLE "city" DROP COLUMN "overpassId"
        `);
        await queryRunner.query(`
            ALTER TABLE "city" DROP COLUMN "countryName"
        `);
    }

}
