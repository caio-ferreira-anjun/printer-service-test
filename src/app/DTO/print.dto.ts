import { IsString, IsNumber, IsOptional} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LabelDTO {
    @ApiProperty({
        description : 'Nome do Cliente',
        example : `Shein`
    })
    @IsString()
    client : string;

    @ApiProperty({
        description : 'Tipo de Label',
        example : `A`,
    })
    @IsString()
    label : string;

    @ApiProperty({
        description : 'Número do Container',
        example : `38`,
        required : false
    })
    @IsOptional()
    @IsNumber()
    container : number;

    @ApiProperty({
        description : 'Número da PLP',
        example : `453654987`,
        required : false
    })
    @IsOptional()
    @IsNumber()
    plp : number;

    @ApiProperty({
        description : 'Número do Grid',
        example : `50`,
    })
    @IsNumber()
    grid : number;

    @ApiProperty({
        description : 'Número de Pacotes',
        example : `150`,
        required : false
    })
    @IsOptional()
    @IsNumber()
    packages : number;
}