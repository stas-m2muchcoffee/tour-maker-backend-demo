import { MigrationInterface, QueryRunner } from 'typeorm';

export class FillCityAndCategoryTable1762956545926
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert cities
    await queryRunner.query(`
      INSERT INTO "city" ("name", "countryName", "overpassId")
      VALUES
        ('Kyiv', 'Ukraine', '3600421866'),
        ('Paris', 'France', '3600071525'),
        ('London', 'United Kingdom', '3600065606'),
        ('New York', 'United States', '3600175905'),
        ('Berlin', 'Germany', '3600062422'),
        ('Rome', 'Italy', '3600041485'),
        ('Barcelona', 'Spain', '3600347950')
    `);

    // Insert categories
    await queryRunner.query(`
      INSERT INTO "category" ("name", "overpassCategories")
      VALUES
        ('Animals', ARRAY['"tourism"="zoo"', '"tourism"="aquarium"']),
        ('Museums', ARRAY['"tourism"="museum"', '"tourism"="gallery"']),
        ('Parks', ARRAY['"leisure"="park"', '"leisure"="water_park"', '"tourism"="theme_park"']),
        ('Monuments', ARRAY['historic=monument', 'historic=memorial']),
        ('Religion', ARRAY['"building"="cathedral"', '"building"="church"', '"building"="chapel"', '"building"="mosque"', '"building"="synagogue"', '"building"="temple"', '"building"="shrine"']),
        ('Сinema', ARRAY['"amenity"="theatre"', '"amenity"="cinema"'])
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete categories first (due to foreign key constraints)
    await queryRunner.query(`
      DELETE FROM "category"
    `);

    // Delete cities
    await queryRunner.query(`
      DELETE FROM "city"
    `);
  }
}
