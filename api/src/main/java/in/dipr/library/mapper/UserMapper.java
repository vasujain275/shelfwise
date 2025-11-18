package in.dipr.library.mapper;

import in.dipr.library.dtos.UserDTO;
import in.dipr.library.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "currentBorrowedBooksCount", source = "booksIssued")
    UserDTO toDto(User user);

    @Mapping(target = "borrowedBooks", ignore = true)
    @Mapping(target = "issuedTransactions", ignore = true)
    @Mapping(target = "returnedTransactions", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "refreshToken", ignore = true)
    User toEntity(UserDTO userDTO);
}