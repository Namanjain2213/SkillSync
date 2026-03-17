package com.rmg.employee.config;

import com.rmg.employee.model.*;
import com.rmg.employee.repository.McqQuestionRepository;
import com.rmg.employee.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
                                   PasswordEncoder passwordEncoder,
                                   McqQuestionRepository mcqQuestionRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@company.com");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);

                User hr = new User();
                hr.setUsername("hr");
                hr.setPassword(passwordEncoder.encode("hr123"));
                hr.setEmail("hr@company.com");
                hr.setRole(Role.HR);
                userRepository.save(hr);

                User employee = new User();
                employee.setUsername("employee");
                employee.setPassword(passwordEncoder.encode("emp123"));
                employee.setEmail("employee@company.com");
                employee.setRole(Role.EMPLOYEE);
                userRepository.save(employee);

                System.out.println("Default users created: admin/admin123, hr/hr123, employee/emp123");
            }

            initSkill(mcqQuestionRepository, "JAVA",   100, () -> createJavaQuestions(mcqQuestionRepository));
            initSkill(mcqQuestionRepository, "PYTHON", 100, () -> createPythonQuestions(mcqQuestionRepository));
            initSkill(mcqQuestionRepository, "AI_ML",  100, () -> createAiMlQuestions(mcqQuestionRepository));
            initSkill(mcqQuestionRepository, "DOTNET", 100, () -> createDotnetQuestions(mcqQuestionRepository));
        };
    }

    private void initSkill(McqQuestionRepository repo, String skill, int expected, Runnable creator) {
        long count = repo.countBySkill(skill);
        if (count < expected) {
            if (count > 0) repo.deleteBySkill(skill);
            creator.run();
            System.out.println(skill + " questions created (" + expected + ").");
        }
    }

    private void save(McqQuestionRepository repo, String skill, DifficultyLevel level,
                      String q, String a, String b, String c, String d, String ans) {
        McqQuestion question = new McqQuestion();
        question.setSkill(skill);
        question.setDifficulty(level);
        question.setQuestion(q);
        question.setOptionA(a);
        question.setOptionB(b);
        question.setOptionC(c);
        question.setOptionD(d);
        question.setCorrectAnswer(ans);
        repo.save(question);
    }

    // ─────────────────────────────────────────────────────────────
    // JAVA  (34 EASY · 33 MODERATE · 33 ADVANCED = 100)
    // ─────────────────────────────────────────────────────────────
    private void createJavaQuestions(McqQuestionRepository r) {
        // EASY (34)
        save(r,"JAVA",DifficultyLevel.EASY,"What is the size of an int in Java?","2 bytes","4 bytes","8 bytes","1 byte","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword declares a class in Java?","class","Class","new","object","A");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the default value of a boolean field?","true","false","null","0","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which method is the entry point of a Java program?","start()","run()","main()","init()","C");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword is used to inherit a class?","implements","extends","inherits","super","B");
        save(r,"JAVA",DifficultyLevel.EASY,"What does JVM stand for?","Java Virtual Machine","Java Variable Method","Java Verified Module","Java Version Manager","A");
        save(r,"JAVA",DifficultyLevel.EASY,"Which data type stores a single character?","String","char","byte","int","B");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the default value of an int field?","null","1","0","-1","C");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword prevents a class from being subclassed?","static","final","private","abstract","B");
        save(r,"JAVA",DifficultyLevel.EASY,"What symbol is used for single-line comments in Java?","//","#","/*","--","A");
        save(r,"JAVA",DifficultyLevel.EASY,"Which package is automatically imported in every Java program?","java.util","java.io","java.lang","java.net","C");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the size of a long in Java?","4 bytes","8 bytes","16 bytes","2 bytes","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword is used to create an object?","create","object","new","make","C");
        save(r,"JAVA",DifficultyLevel.EASY,"What does OOP stand for?","Object Oriented Programming","Open Object Protocol","Ordered Object Processing","Object Output Print","A");
        save(r,"JAVA",DifficultyLevel.EASY,"Which loop is guaranteed to execute at least once?","for","while","do-while","foreach","C");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the parent class of all Java classes?","Class","Base","Object","Root","C");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword is used to define an interface?","interface","abstract","class","implements","A");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the correct way to print to console in Java?","console.log()","print()","System.out.println()","echo()","C");
        save(r,"JAVA",DifficultyLevel.EASY,"Which access modifier makes a member accessible everywhere?","private","protected","default","public","D");
        save(r,"JAVA",DifficultyLevel.EASY,"What does the 'static' keyword mean?","Belongs to instance","Belongs to class","Cannot be changed","Is private","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which collection maintains insertion order and allows duplicates?","Set","Map","List","Queue","C");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the size of a byte in Java?","4 bits","8 bits","16 bits","32 bits","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword handles exceptions?","throws","catch","try","All of the above","D");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the default value of a String field?","\"\"","null","0","undefined","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which operator checks equality in Java?","=","==","===","equals","B");
        save(r,"JAVA",DifficultyLevel.EASY,"What does 'void' mean as a return type?","Returns null","Returns 0","Returns nothing","Returns boolean","C");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword is used to call a superclass constructor?","this()","parent()","super()","base()","C");
        save(r,"JAVA",DifficultyLevel.EASY,"What is a constructor?","A method that returns a value","A special method called on object creation","A static method","An abstract method","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword makes a variable constant?","static","const","final","immutable","C");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the ternary operator syntax?","if?then:else","condition?true:false","condition:true?false","true?condition:false","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which class is used to read user input from console?","InputReader","Scanner","BufferedReader","Console","B");
        save(r,"JAVA",DifficultyLevel.EASY,"What does 'break' do in a loop?","Skips current iteration","Exits the loop","Pauses execution","Restarts the loop","B");
        save(r,"JAVA",DifficultyLevel.EASY,"Which keyword is used to throw an exception manually?","raise","throw","throws","error","C");
        save(r,"JAVA",DifficultyLevel.EASY,"What is the index of the first element in a Java array?","1","-1","0","Depends on type","C");

        // MODERATE (33)
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is method overloading?","Same method name, different parameters","Same method name, same parameters","Different method name, same parameters","Overriding a parent method","A");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the difference between == and .equals()?","No difference","== compares references, .equals() compares content","== compares content, .equals() compares references","Both compare content","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which interface must be implemented for a class to be iterable?","Iterator","Iterable","Collection","Enumerable","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is autoboxing in Java?","Converting int to Integer automatically","Converting String to int","Converting array to list","Converting object to primitive","A");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What does the 'transient' keyword do?","Makes field thread-safe","Excludes field from serialization","Makes field immutable","Marks field as deprecated","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which exception is thrown when dividing by zero with integers?","NullPointerException","IllegalArgumentException","ArithmeticException","NumberFormatException","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the purpose of the 'finally' block?","Runs only on exception","Runs only on success","Always runs after try/catch","Catches all exceptions","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is an abstract class?","A class with no methods","A class that cannot be instantiated directly","A class with only static methods","A class with private constructor","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which collection does not allow duplicate elements?","ArrayList","LinkedList","HashSet","Vector","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the difference between ArrayList and LinkedList?","No difference","ArrayList uses array internally, LinkedList uses nodes","LinkedList is faster for random access","ArrayList is faster for insertion","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What does 'synchronized' keyword do?","Makes method faster","Ensures only one thread executes at a time","Makes method static","Prevents inheritance","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is a lambda expression?","A named method","An anonymous function","A class definition","A loop construct","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which method converts a String to int?","Integer.parse()","Integer.parseInt()","String.toInt()","Integer.valueOf()","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the purpose of 'this' keyword?","Refers to parent class","Refers to current instance","Refers to static context","Refers to interface","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is a checked exception?","Exception at runtime","Exception that must be handled at compile time","Exception in static block","Exception in constructor","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which keyword is used for multiple interface implementation?","extends","inherits","implements","uses","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the HashMap's time complexity for get()?","O(n)","O(log n)","O(1) average","O(n²)","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What does 'instanceof' operator do?","Creates an instance","Checks if object is of a type","Compares two objects","Casts an object","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is method overriding?","Defining same method in same class","Redefining a parent method in child class","Overloading a method","Hiding a static method","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which stream operation is terminal?","map()","filter()","collect()","peek()","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the purpose of Optional class?","Replace null with a container","Speed up collections","Handle concurrency","Serialize objects","A");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is a functional interface?","Interface with many methods","Interface with exactly one abstract method","Interface with static methods","Interface with default methods","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which annotation marks a method as overriding?","@Override","@Overrides","@Inherited","@Super","A");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the difference between throw and throws?","No difference","throw is used to throw, throws declares exceptions","throws is used to throw, throw declares","Both declare exceptions","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is a static nested class?","A class inside a method","A nested class that doesn't need outer instance","A class with static methods only","An anonymous class","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which collection maintains sorted order?","HashMap","ArrayList","TreeSet","LinkedList","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What does String.intern() do?","Converts to int","Returns canonical representation from string pool","Reverses the string","Trims whitespace","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the purpose of Comparable interface?","Sorting objects","Comparing two different objects","Cloning objects","Serializing objects","A");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which keyword prevents method overriding?","static","private","final","abstract","C");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is a varargs parameter?","Fixed number of arguments","Variable number of arguments","Array parameter","Optional parameter","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What does Collections.unmodifiableList() return?","A sorted list","A list that throws on modification","A copy of the list","An empty list","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"What is the difference between String and StringBuilder?","No difference","String is immutable, StringBuilder is mutable","StringBuilder is immutable","String is faster for concatenation","B");
        save(r,"JAVA",DifficultyLevel.MODERATE,"Which annotation suppresses compiler warnings?","@Deprecated","@SuppressWarnings","@Override","@FunctionalInterface","B");

        // ADVANCED (33)
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the Java Memory Model?","A specification for heap size","Rules for how threads interact through memory","A garbage collection algorithm","A JVM configuration","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a happens-before relationship?","A scheduling algorithm","A guarantee that one action is visible to another","A thread priority rule","A lock mechanism","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the difference between ReentrantLock and synchronized?","No difference","ReentrantLock provides more control (tryLock, fairness)","synchronized is more flexible","ReentrantLock is slower","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a ConcurrentHashMap?","A synchronized HashMap","A thread-safe map with segment-level locking","A sorted thread-safe map","An immutable map","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of volatile keyword?","Makes variable final","Ensures visibility of changes across threads","Makes variable thread-local","Prevents caching","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a WeakReference?","A reference that prevents GC","A reference that allows GC to collect the object","A null reference","A soft reference","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the difference between Callable and Runnable?","No difference","Callable can return a value and throw checked exceptions","Runnable can return values","Callable cannot throw exceptions","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a CompletableFuture?","A blocking future","A future that supports chaining and composition","A scheduled task","A thread pool","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of ForkJoinPool?","Single-threaded execution","Work-stealing pool for divide-and-conquer tasks","Fixed thread pool","Cached thread pool","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is bytecode in Java?","Machine code","Intermediate code executed by JVM","Source code","Compiled native code","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is JIT compilation?","Ahead-of-time compilation","Just-in-time compilation of bytecode to native code","Interpreted execution","Lazy loading","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the G1 garbage collector?","A generational GC for large heaps with predictable pause times","A simple mark-sweep GC","A reference counting GC","A concurrent GC for small heaps","A");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a phantom reference?","A null reference","A reference used for pre-mortem cleanup","A weak reference","A soft reference","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of ClassLoader?","Compiles Java code","Loads class files into JVM at runtime","Manages memory","Handles exceptions","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is reflection in Java?","A design pattern","Ability to inspect and modify program structure at runtime","A concurrency mechanism","A serialization technique","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a deadlock?","A slow thread","Two or more threads waiting for each other's locks indefinitely","A memory leak","An infinite loop","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the difference between Executor and ExecutorService?","No difference","ExecutorService extends Executor with lifecycle management","Executor is newer","ExecutorService is single-threaded","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a ThreadLocal variable?","A shared variable","A variable with a separate copy per thread","A volatile variable","A synchronized variable","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of the Proxy pattern in Java?","Caching","Providing a surrogate to control access to an object","Sorting","Serialization","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is covariant return type?","Returning a supertype","Overriding method can return a subtype of the original return type","Returning void","Returning null","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is type erasure in generics?","Removing type parameters at compile time","Adding type checks at runtime","Casting objects","Removing unused types","A");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a sealed class (Java 17+)?","A final class","A class that restricts which classes can extend it","An abstract class","An interface","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of record types (Java 16+)?","Mutable data carriers","Immutable data carriers with auto-generated methods","Abstract data types","Functional interfaces","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the difference between fail-fast and fail-safe iterators?","No difference","Fail-fast throws ConcurrentModificationException; fail-safe works on a copy","Fail-safe is faster","Fail-fast works on a copy","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a memory leak in Java?","Null pointer","Objects referenced but no longer needed, preventing GC","Stack overflow","Array out of bounds","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of Phaser in concurrency?","A lock","A reusable synchronization barrier for multiple phases","A thread pool","A future","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the difference between HashMap and IdentityHashMap?","No difference","IdentityHashMap uses == for key comparison instead of equals()","HashMap is faster","IdentityHashMap is sorted","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a spliterator?","A string splitter","An iterator that supports parallel traversal","A sorted iterator","A concurrent list","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of StampedLock?","A simple mutex","A lock with optimistic read support for better throughput","A reentrant lock","A read-write lock","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the difference between String pool and heap for Strings?","No difference","String literals go to pool; new String() goes to heap","All strings go to heap","All strings go to pool","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of invokedynamic bytecode instruction?","Static method calls","Supports dynamic language features and lambda implementation","Array access","Exception handling","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is a method handle?","A method reference","A typed, directly executable reference to a method","A lambda expression","An anonymous class","B");
        save(r,"JAVA",DifficultyLevel.ADVANCED,"What is the purpose of VarHandle (Java 9+)?","Variable declaration","Low-level atomic operations on fields and array elements","Thread management","Memory allocation","B");
    }

    // ─────────────────────────────────────────────────────────────
    // PYTHON  (34 EASY · 33 MODERATE · 33 ADVANCED = 100)
    // ─────────────────────────────────────────────────────────────
    private void createPythonQuestions(McqQuestionRepository r) {
        // EASY (34)
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you create a list in Python?","list = ()","list = []","list = {}","list = <>","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which keyword defines a function?","func","def","function","define","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is the output of type([])?","<class 'array'>","<class 'tuple'>","<class 'list'>","<class 'dict'>","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you create a dictionary?","dict = []","dict = ()","dict = {}","dict = <>","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which keyword is used for a conditional statement?","when","if","case","check","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you print to console in Python?","console.log()","echo()","print()","System.out.println()","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is the correct way to create a comment?","// comment","/* comment */","# comment","-- comment","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which data type is immutable and ordered?","list","dict","set","tuple","D");
        save(r,"PYTHON",DifficultyLevel.EASY,"What does len() return?","Last element","Number of elements","First element","Sum of elements","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you start a for loop over a list?","for i in list:","for(i in list)","foreach i in list:","loop i in list:","A");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is None in Python?","0","False","Null value","Empty string","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which operator is used for exponentiation?","^","**","^^","exp()","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you check the type of a variable?","typeof()","type()","getType()","instanceof","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"What does range(5) produce?","[1,2,3,4,5]","[0,1,2,3,4]","[0,1,2,3,4,5]","[1,2,3,4]","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which keyword exits a loop?","exit","stop","break","end","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you access the first element of list x?","x[1]","x[0]","x.first()","x.get(0)","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is a tuple?","A mutable ordered collection","An immutable ordered collection","An unordered collection","A key-value store","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which method adds an element to a list?","add()","push()","append()","insert()","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"What does 'import math' do?","Creates a math variable","Imports the math module","Defines math functions","Loads a math file","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you get user input?","read()","scan()","input()","get()","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is the result of 10 // 3?","3.33","3","4","1","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which keyword is used for exception handling?","catch","except","handle","error","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"What does str() do?","Converts to string","Creates a string class","Checks if string","Splits a string","A");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you check if a key exists in a dict?","key in dict","dict.has(key)","dict.contains(key)","dict.exists(key)","A");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is the result of bool(0)?","True","False","None","Error","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which method removes and returns the last list element?","remove()","delete()","pop()","discard()","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"What does 'pass' do?","Exits function","Does nothing (placeholder)","Skips iteration","Raises exception","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you concatenate two strings?","str1 + str2","str1.concat(str2)","str1 & str2","concat(str1, str2)","A");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is the correct way to define a class?","class MyClass:","Class MyClass:","define class MyClass:","new class MyClass:","A");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which keyword returns a value from a function?","output","send","return","yield","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"What does list.sort() do?","Returns sorted copy","Sorts list in place","Reverses list","Removes duplicates","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"How do you create a set?","set = []","set = ()","set = {}","set = set[]","C");
        save(r,"PYTHON",DifficultyLevel.EASY,"What is the result of 'Hello'[1]?","H","e","l","He","B");
        save(r,"PYTHON",DifficultyLevel.EASY,"Which function converts a string to integer?","toInt()","int()","Integer()","parse()","B");

        // MODERATE (33)
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a list comprehension?","A way to create lists concisely using a single expression","A loop over a list","A list method","A sorted list","A");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the difference between deepcopy and copy?","No difference","deepcopy copies nested objects; copy is shallow","copy is deeper","deepcopy is faster","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a generator in Python?","A function that returns a list","A function that yields values lazily","A class that creates objects","A module for random numbers","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does *args allow?","Keyword arguments","Variable positional arguments","Default arguments","Named arguments","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does **kwargs allow?","Variable positional arguments","Variable keyword arguments","Default values","Type hints","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a decorator in Python?","A class attribute","A function that wraps another function","A comment style","A module","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the purpose of __init__ method?","Destructor","Constructor called on object creation","Static initializer","Class method","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the difference between is and ==?","No difference","is checks identity; == checks equality","== checks identity","is checks equality","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a lambda function?","A named function","An anonymous single-expression function","A class method","A generator","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does map() do?","Filters elements","Applies a function to each element","Reduces a list","Sorts elements","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does filter() do?","Applies function to elements","Returns elements where function is True","Sorts elements","Maps elements","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the purpose of enumerate()?","Counts elements","Returns index-value pairs","Sorts with index","Filters with index","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a context manager?","A memory manager","An object managing resource setup/teardown via with statement","A thread manager","A module manager","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does zip() do?","Compresses files","Combines multiple iterables element-wise","Sorts two lists","Merges dicts","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the GIL in Python?","Global Import Lock","Global Interpreter Lock preventing true multi-threading","A garbage collector","A memory allocator","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the difference between a module and a package?","No difference","A module is a .py file; a package is a directory with __init__.py","A package is a single file","A module is a directory","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does @staticmethod do?","Creates instance method","Creates method that doesn't receive class or instance","Creates class method","Creates abstract method","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does @classmethod do?","Creates static method","Creates method that receives class as first argument","Creates instance method","Creates property","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a property in Python?","A class variable","A managed attribute with getter/setter","A static variable","A module attribute","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the purpose of __str__ method?","Converts to bytes","Returns human-readable string representation","Compares objects","Hashes object","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is multiple inheritance?","Inheriting from multiple classes","Inheriting multiple times","Overriding multiple methods","Implementing multiple interfaces","A");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is MRO in Python?","Memory Resource Order","Method Resolution Order for multiple inheritance","Module Resolution Order","Method Return Object","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does the 'global' keyword do?","Creates a new variable","Declares a variable as global scope","Imports a module","Deletes a variable","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a frozenset?","A sorted set","An immutable set","An empty set","A set with frozen elements","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does sorted() return?","Sorts in place","Returns a new sorted list","Returns sorted iterator","Sorts and returns None","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the purpose of __repr__?","Human-readable string","Unambiguous string for developers/debugging","Hash value","Comparison result","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does itertools.chain() do?","Chains functions","Combines multiple iterables into one","Creates infinite iterator","Filters iterables","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is a named tuple?","A dict subclass","A tuple subclass with named fields","A list with names","A class with tuple","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does collections.defaultdict do?","Sorts a dict","Returns default value for missing keys","Merges dicts","Filters dict","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the walrus operator :=?","Assignment in expressions","Comparison operator","Slice operator","Unpacking operator","A");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does functools.partial() do?","Partially evaluates a function","Creates a new function with some arguments pre-filled","Caches function results","Composes functions","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What is the purpose of __slots__?","Defines methods","Restricts instance attributes to save memory","Defines class variables","Enables pickling","B");
        save(r,"PYTHON",DifficultyLevel.MODERATE,"What does any() return?","True if all elements are true","True if at least one element is true","Count of true elements","List of true elements","B");

        // ADVANCED (33)
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is a metaclass?","A base class","A class whose instances are classes","A mixin","An abstract class","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __new__?","Initializes instance","Creates and returns a new instance before __init__","Deletes instance","Copies instance","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is a coroutine in Python?","A thread","A function that can be paused and resumed with async/await","A generator","A callback","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the event loop in asyncio?","A for loop","The core mechanism that runs and manages coroutines","A thread pool","A callback queue","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the difference between asyncio.gather and asyncio.wait?","No difference","gather returns results in order; wait returns sets of futures","wait is faster","gather handles errors differently","A");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is a descriptor in Python?","A docstring","An object that defines __get__, __set__, or __delete__","A class decorator","A property alias","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __getattr__ vs __getattribute__?","No difference","__getattr__ called for missing attrs; __getattribute__ called for all","__getattribute__ is for missing attrs","Both are the same","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is a weak reference in Python?","A null reference","A reference that doesn't prevent garbage collection","A soft reference","A cached reference","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __del__?","Constructor","Destructor called before object is garbage collected","Comparison method","Copy method","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is CPython?","A Python compiler","The reference implementation of Python written in C","A Python IDE","A Python package","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of sys.intern()?","Imports a module","Interns a string to the string pool for identity comparison","Clears memory","Optimizes loops","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is a memory view?","A debugger","An object exposing buffer protocol for zero-copy slicing","A profiler","A memory allocator","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __enter__ and __exit__?","Constructor/destructor","Context manager protocol for with statement","Iterator protocol","Comparison protocol","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the difference between multiprocessing and threading?","No difference","multiprocessing bypasses GIL with separate processes; threading shares memory","threading is faster for CPU tasks","multiprocessing shares memory","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is a C extension in Python?","A .c file","A module written in C for performance-critical code","A compiled Python file","A Cython file","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __hash__?","Converts to string","Returns integer hash for use in dicts and sets","Compares objects","Copies objects","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is abstract base class (ABC)?","A base class","A class that enforces interface contracts on subclasses","A mixin","A metaclass","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of dataclasses module?","Creates databases","Auto-generates __init__, __repr__, __eq__ for data classes","Manages data files","Validates data","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the difference between pickle and json serialization?","No difference","pickle is Python-specific and handles more types; json is language-agnostic","json handles more types","pickle is faster always","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __iter__ and __next__?","Context manager protocol","Iterator protocol for custom iteration","Comparison protocol","Arithmetic protocol","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is a type annotation in Python?","A comment","A hint about expected types (not enforced at runtime)","A runtime type check","A cast operation","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of typing.Protocol?","A network protocol","Structural subtyping (duck typing with type checking)","A base class","An interface","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of functools.lru_cache?","Clears cache","Memoizes function results with LRU eviction","Logs function calls","Profiles functions","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the difference between __eq__ and __hash__ contract?","No difference","If a == b then hash(a) == hash(b) must hold","hash equality implies object equality","They are independent","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of contextlib.contextmanager?","Creates threads","Turns a generator function into a context manager","Creates decorators","Manages imports","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __class_getitem__?","Gets class name","Supports generic syntax like MyClass[T]","Gets class attributes","Creates class instances","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __init_subclass__?","Initializes instance","Called when a class is subclassed, for customization","Validates subclass","Copies subclass","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of sys.settrace?","Sets output","Installs a trace function for debugging/profiling","Sets recursion limit","Sets encoding","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the difference between exec and eval?","No difference","exec executes statements; eval evaluates a single expression","eval executes statements","exec returns a value","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __prepare__ in metaclasses?","Prepares instance","Returns the namespace dict used during class body execution","Prepares arguments","Validates class","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __set_name__?","Sets variable name","Called when descriptor is assigned to a class attribute","Sets class name","Sets module name","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __missing__ in dict subclass?","Handles deletion","Called when a key is not found","Handles iteration","Handles comparison","B");
        save(r,"PYTHON",DifficultyLevel.ADVANCED,"What is the purpose of __format__?","Converts to string","Customizes format() and f-string formatting","Validates format","Parses format","B");
    }

    // ─────────────────────────────────────────────────────────────
    // AI_ML  (34 EASY · 33 MODERATE · 33 ADVANCED = 100)
    // ─────────────────────────────────────────────────────────────
    private void createAiMlQuestions(McqQuestionRepository r) {
        // EASY (34)
        save(r,"AI_ML",DifficultyLevel.EASY,"What does AI stand for?","Automated Intelligence","Artificial Intelligence","Analytical Interface","Automated Interface","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does ML stand for?","Machine Learning","Model Learning","Managed Logic","Modular Language","A");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which of the following is a supervised learning algorithm?","K-Means","Linear Regression","DBSCAN","PCA","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is a training dataset used for?","Testing the model","Teaching the model to learn patterns","Deploying the model","Visualizing data","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is overfitting?","Model performs well on all data","Model performs well on training but poorly on new data","Model underfits the data","Model has too few parameters","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which library is most commonly used for ML in Python?","NumPy","Pandas","scikit-learn","Matplotlib","C");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is a label in supervised learning?","An input feature","The output/target variable","A hyperparameter","A training step","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does a confusion matrix show?","Model accuracy only","True/false positives and negatives","Training loss","Feature importance","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is the purpose of a test dataset?","Train the model","Tune hyperparameters","Evaluate model on unseen data","Preprocess data","C");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which algorithm is used for classification?","Linear Regression","K-Means","Logistic Regression","PCA","C");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is a neural network inspired by?","Computer circuits","The human brain","Decision trees","Linear algebra","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does NLP stand for?","Natural Language Processing","Neural Learning Protocol","Numeric Logic Processing","Network Layer Protocol","A");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is the purpose of normalization in ML?","Remove outliers","Scale features to a similar range","Increase model complexity","Reduce training time","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which of the following is an unsupervised learning task?","Classification","Regression","Clustering","Prediction","C");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is a feature in machine learning?","The output variable","An input variable used for prediction","A model parameter","A training epoch","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does CNN stand for?","Convolutional Neural Network","Connected Neural Node","Cyclic Neural Network","Computed Node Network","A");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is the activation function in a neural network?","A loss function","A function that introduces non-linearity","A weight initializer","A regularizer","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which metric measures classification accuracy?","MSE","RMSE","Accuracy score","R-squared","C");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is gradient descent?","A data preprocessing step","An optimization algorithm to minimize loss","A regularization technique","A feature selection method","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does RNN stand for?","Recurrent Neural Network","Random Neural Node","Recursive Network Node","Relational Neural Network","A");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is the purpose of a validation set?","Train the model","Tune hyperparameters during training","Final evaluation","Data augmentation","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which of the following is a deep learning framework?","scikit-learn","Pandas","TensorFlow","Matplotlib","C");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is a hyperparameter?","A learned model weight","A parameter set before training","A feature value","A training sample","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does GAN stand for?","Generative Adversarial Network","General Adaptive Node","Gradient Averaging Network","Grouped Attention Network","A");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is the purpose of dropout in neural networks?","Speed up training","Prevent overfitting by randomly disabling neurons","Increase model size","Normalize inputs","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which algorithm builds a tree of decisions?","K-Means","Decision Tree","Linear Regression","SVM","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is transfer learning?","Training from scratch","Reusing a pre-trained model on a new task","Transferring data between models","Copying model weights","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is the loss function used for?","Feature extraction","Measuring model prediction error","Data augmentation","Weight initialization","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does SVM stand for?","Support Vector Machine","Supervised Variable Model","Stochastic Variance Method","Sequential Vector Map","A");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is an epoch in training?","A single data sample","One complete pass through the training dataset","A batch of data","A model layer","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is the purpose of PCA?","Classification","Dimensionality reduction","Clustering","Regression","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"Which library is used for deep learning in Python?","scikit-learn","Pandas","PyTorch","Seaborn","C");
        save(r,"AI_ML",DifficultyLevel.EASY,"What is a batch in machine learning?","Full dataset","A subset of training data used in one update step","A single sample","A validation set","B");
        save(r,"AI_ML",DifficultyLevel.EASY,"What does LSTM stand for?","Long Short-Term Memory","Linear Sequential Training Model","Layered Stochastic Training Method","Large Scale Training Module","A");

        // MODERATE (33)
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the bias-variance tradeoff?","Tradeoff between model size and speed","Tradeoff between underfitting (high bias) and overfitting (high variance)","Tradeoff between accuracy and recall","Tradeoff between features and labels","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is cross-validation?","A single train/test split","Technique to evaluate model by splitting data into multiple folds","A regularization method","A feature selection method","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the difference between precision and recall?","No difference","Precision is TP/(TP+FP); recall is TP/(TP+FN)","Recall is TP/(TP+FP)","Precision measures all positives","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the F1 score?","Accuracy metric","Harmonic mean of precision and recall","Mean squared error","R-squared value","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is regularization in ML?","Data preprocessing","Technique to prevent overfitting by penalizing complexity","Feature engineering","Model ensembling","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the difference between L1 and L2 regularization?","No difference","L1 (Lasso) produces sparse weights; L2 (Ridge) shrinks weights evenly","L2 produces sparse weights","L1 is always better","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the vanishing gradient problem?","Gradients become too large","Gradients become very small, slowing learning in deep networks","Model overfits","Loss function diverges","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is backpropagation?","Forward pass through network","Algorithm to compute gradients by propagating error backward","A regularization technique","A weight initialization method","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of batch normalization?","Increase batch size","Normalize layer inputs to stabilize and speed up training","Reduce model size","Augment data","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the difference between bagging and boosting?","No difference","Bagging trains models in parallel; boosting trains sequentially correcting errors","Boosting is parallel","Bagging corrects errors sequentially","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is Random Forest?","A single decision tree","An ensemble of decision trees using bagging","A boosting algorithm","A neural network","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of the softmax function?","Binary classification","Converts logits to probability distribution over classes","Regression output","Feature normalization","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the ROC curve?","A training curve","A plot of true positive rate vs false positive rate at various thresholds","A loss curve","A precision-recall curve","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is AUC in ML evaluation?","Average Update Count","Area Under the ROC Curve measuring classifier performance","Accuracy Under Conditions","Adaptive Update Coefficient","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of word embeddings?","Tokenize text","Represent words as dense vectors capturing semantic meaning","Count word frequency","Remove stop words","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the attention mechanism in deep learning?","A regularization technique","A mechanism allowing models to focus on relevant parts of input","A pooling operation","A normalization layer","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the difference between generative and discriminative models?","No difference","Generative models learn data distribution; discriminative learn decision boundary","Discriminative models generate data","Both are the same","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is data augmentation?","Removing data","Artificially increasing training data by transforming existing samples","Normalizing data","Splitting data","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of the learning rate?","Batch size control","Controls how much weights are updated per gradient step","Regularization strength","Dropout rate","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is K-Nearest Neighbors (KNN)?","A neural network","A lazy learning algorithm classifying based on nearest training samples","A tree algorithm","A linear model","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the elbow method used for?","Choosing learning rate","Determining optimal number of clusters in K-Means","Selecting features","Tuning regularization","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of the ReLU activation function?","Squash values to 0-1","Introduce non-linearity while avoiding vanishing gradient","Normalize outputs","Compute probabilities","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is feature engineering?","Selecting a model","Creating or transforming features to improve model performance","Tuning hyperparameters","Evaluating models","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of pooling layers in CNNs?","Add non-linearity","Reduce spatial dimensions and computation","Normalize activations","Increase depth","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the difference between classification and regression?","No difference","Classification predicts categories; regression predicts continuous values","Regression predicts categories","Both predict the same","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of the Adam optimizer?","A regularization method","An adaptive learning rate optimizer combining momentum and RMSProp","A loss function","A weight initializer","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of one-hot encoding?","Normalize features","Convert categorical variables to binary vectors","Reduce dimensions","Scale features","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the difference between model parameters and hyperparameters?","No difference","Parameters are learned during training; hyperparameters are set before training","Hyperparameters are learned","Both are set manually","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of the sigmoid activation function?","Multi-class output","Squash values to 0-1 range for binary classification","Regression output","Feature normalization","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of early stopping?","Speed up training","Stop training when validation loss stops improving to prevent overfitting","Increase model size","Reduce learning rate","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the difference between shallow and deep learning?","No difference","Shallow learning uses few layers; deep learning uses many layers","Deep learning uses fewer layers","Both use the same architecture","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of the embedding layer in NLP?","Tokenization","Maps discrete tokens to dense continuous vectors","Attention computation","Positional encoding","B");
        save(r,"AI_ML",DifficultyLevel.MODERATE,"What is the purpose of the confusion matrix diagonal?","Shows false positives","Shows correctly classified samples (true positives and true negatives)","Shows false negatives","Shows model loss","B");

        // ADVANCED (33)
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the Transformer architecture?","A CNN variant","A model using self-attention without recurrence, basis of modern NLP","A recurrent network","A GAN variant","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is self-attention in Transformers?","A regularization technique","A mechanism where each token attends to all other tokens in the sequence","A pooling operation","A normalization layer","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of positional encoding in Transformers?","Normalize inputs","Inject sequence order information since attention is order-agnostic","Reduce dimensions","Compute attention weights","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between BERT and GPT?","No difference","BERT is bidirectional encoder; GPT is unidirectional decoder","GPT is bidirectional","BERT is a decoder","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the key, query, value in attention?","Data storage","Query finds relevant keys; values are aggregated based on attention scores","Regularization","Normalization","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is knowledge distillation?","Data compression","Training a small student model to mimic a large teacher model","Feature extraction","Model pruning","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of residual connections in deep networks?","Regularization","Allow gradients to flow directly, enabling training of very deep networks","Normalization","Pooling","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between model pruning and quantization?","No difference","Pruning removes weights; quantization reduces numerical precision","Quantization removes weights","Both are the same","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the variational autoencoder (VAE)?","Classification","Generative model learning a latent distribution for data generation","Clustering","Regression","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the mode collapse problem in GANs?","Generator overfits","Generator produces limited variety of outputs, ignoring input diversity","Discriminator fails","Training diverges","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the Wasserstein distance in GANs?","Measure accuracy","Provide a smoother training signal than JS divergence for GANs","Regularize generator","Normalize discriminator","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is meta-learning?","Learning about data","Learning to learn — training models that adapt quickly to new tasks","Transfer learning","Multi-task learning","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of RLHF (Reinforcement Learning from Human Feedback)?","Unsupervised training","Align language models with human preferences using human-rated outputs","Data augmentation","Model compression","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between model-based and model-free RL?","No difference","Model-based RL learns environment dynamics; model-free learns policy directly","Model-free uses a world model","Both are the same","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the policy gradient in RL?","Value estimation","Directly optimize the policy by computing gradients of expected reward","Q-value computation","Environment modeling","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the Q-function in reinforcement learning?","Policy representation","Estimates expected cumulative reward for a state-action pair","Environment model","Reward shaping","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between online and offline learning?","No difference","Online learning updates continuously with new data; offline trains on fixed dataset","Offline is continuous","Both update continuously","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the Expectation-Maximization (EM) algorithm?","Supervised classification","Iteratively estimate parameters for models with latent variables","Feature selection","Dimensionality reduction","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the Gaussian Mixture Model (GMM)?","Classification","Probabilistic model representing data as a mixture of Gaussian distributions","Regression","Dimensionality reduction","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the kernel trick in SVM?","Regularization","Map data to higher dimensions implicitly for non-linear classification","Feature selection","Normalization","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between hard and soft margin SVM?","No difference","Hard margin requires perfect separation; soft margin allows some misclassification","Soft margin is stricter","Both are the same","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the Bayesian optimization in hyperparameter tuning?","Random search","Use probabilistic model to efficiently search hyperparameter space","Grid search","Manual tuning","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the t-SNE algorithm?","Classification","Non-linear dimensionality reduction for visualization of high-dimensional data","Clustering","Regression","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between UMAP and t-SNE?","No difference","UMAP is faster and better preserves global structure than t-SNE","t-SNE is faster","Both preserve global structure equally","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the CTC loss in sequence models?","Image classification","Enable training of sequence models without aligned input-output pairs","Regression","Clustering","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the beam search algorithm in NLP?","Training optimization","Approximate decoding strategy that keeps top-k candidates at each step","Feature extraction","Attention computation","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between fine-tuning and feature extraction in transfer learning?","No difference","Fine-tuning updates pre-trained weights; feature extraction freezes them","Feature extraction updates weights","Both update all weights","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the Huber loss function?","Binary classification","Combines MSE and MAE to be robust to outliers","Multi-class classification","Regularization","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the focal loss?","Regression","Address class imbalance by down-weighting easy examples","Clustering","Dimensionality reduction","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the SHAP values in ML explainability?","Model training","Explain individual predictions by attributing contribution of each feature","Feature selection","Regularization","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the LIME technique?","Model compression","Locally approximate a complex model with an interpretable one for explanations","Data augmentation","Hyperparameter tuning","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the difference between parametric and non-parametric models?","No difference","Parametric have fixed parameters; non-parametric grow with data","Non-parametric have fixed parameters","Both are the same","B");
        save(r,"AI_ML",DifficultyLevel.ADVANCED,"What is the purpose of the Dirichlet process in Bayesian ML?","Classification","Non-parametric prior for clustering with unknown number of clusters","Regression","Feature selection","B");
    }

    // ─────────────────────────────────────────────────────────────
    // DOTNET  (34 EASY · 33 MODERATE · 33 ADVANCED = 100)
    // ─────────────────────────────────────────────────────────────
    private void createDotnetQuestions(McqQuestionRepository r) {
        // EASY (34)
        save(r,"DOTNET",DifficultyLevel.EASY,"What does CLR stand for in .NET?","Common Language Runtime","Compiled Logic Runtime","Core Language Resource","Common Library Reference","A");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which language is most commonly used with .NET?","Java","Python","C#","Ruby","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the file extension for a C# source file?",".java",".cs",".cpp",".py","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does CIL stand for?","Common Intermediate Language","Compiled Interface Layer","Core Instruction Library","Common Import Language","A");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword defines a class in C#?","class","Class","define","object","A");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the entry point method in a C# console application?","Start()","Run()","Main()","Init()","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword is used to inherit a class in C#?","implements","extends",":","inherits","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does the 'var' keyword do in C#?","Declares a variable as variant","Enables implicit type inference","Declares a global variable","Creates a variant type","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the default value of an int in C#?","null","1","0","-1","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword makes a class non-inheritable in C#?","static","sealed","private","abstract","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does 'using' statement do in C#?","Imports a namespace","Declares a variable","Creates an object","Defines a method","A");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is a namespace in C#?","A variable type","A container for organizing classes and types","A method modifier","A loop construct","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword creates a new object in C#?","create","object","new","make","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the parent class of all C# classes?","Base","Root","Object","Class","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does 'void' mean as a return type in C#?","Returns null","Returns 0","Returns nothing","Returns bool","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which access modifier makes a member accessible only within its class?","public","protected","internal","private","D");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the correct way to print to console in C#?","console.log()","print()","Console.WriteLine()","echo()","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword defines an interface in C#?","interface","abstract","class","implements","A");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does the 'static' keyword mean in C#?","Belongs to instance","Belongs to class","Cannot be changed","Is private","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword makes a variable constant in C#?","static","readonly","const","final","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is a property in C#?","A field","A member with get/set accessors","A method","A constructor","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does 'null' represent in C#?","Zero","Empty string","Absence of a value","False","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which loop is guaranteed to execute at least once in C#?","for","while","do-while","foreach","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the purpose of a constructor in C#?","Returns a value","Initializes an object when created","A static method","Destroys an object","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword is used to handle exceptions in C#?","handle","catch","except","error","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does 'break' do in a C# loop?","Skips current iteration","Exits the loop","Pauses execution","Restarts the loop","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the ternary operator in C#?","if?then:else","condition?true:false","condition:true?false","true?condition:false","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which collection type maintains insertion order in C#?","HashSet","Dictionary","List","Queue","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does 'override' keyword do in C#?","Hides a method","Provides new implementation of a virtual method","Creates a new method","Calls base method","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the purpose of 'base' keyword in C#?","Refers to current instance","Refers to parent class","Refers to static context","Refers to interface","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does 'this' keyword refer to in C#?","Parent class","Current instance","Static context","Interface","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"Which keyword declares an abstract method in C#?","virtual","override","abstract","sealed","C");
        save(r,"DOTNET",DifficultyLevel.EASY,"What is the size of an int in C#?","2 bytes","4 bytes","8 bytes","1 byte","B");
        save(r,"DOTNET",DifficultyLevel.EASY,"What does 'continue' do in a C# loop?","Exits the loop","Skips to the next iteration","Pauses execution","Restarts the loop","B");

        // MODERATE (33)
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between value types and reference types in C#?","No difference","Value types store data directly; reference types store a reference to data","Reference types store data directly","Both store references","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is boxing in C#?","Wrapping a class","Converting a value type to a reference type (object)","Converting string to int","Wrapping a method","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'virtual' keyword?","Prevents overriding","Allows a method to be overridden in derived classes","Makes method static","Makes method abstract","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between abstract class and interface in C#?","No difference","Abstract class can have implementation; interface (pre-C#8) cannot","Interface can have implementation","Both are the same","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is a delegate in C#?","A class","A type-safe function pointer","An interface","An event","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is an event in C#?","A method","A notification mechanism built on delegates","A property","A field","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is LINQ in C#?","A database","Language Integrated Query for querying collections","A UI framework","A serialization library","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of 'async' and 'await' in C#?","Multi-threading","Enable asynchronous programming without blocking threads","Parallel processing","Exception handling","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between IEnumerable and IQueryable?","No difference","IEnumerable executes in memory; IQueryable translates to query (e.g., SQL)","IQueryable executes in memory","Both are the same","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'using' statement with IDisposable?","Import namespace","Ensure Dispose() is called automatically when block exits","Create object","Handle exceptions","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is a lambda expression in C#?","A named method","An anonymous function using => syntax","A class definition","A loop construct","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between String and string in C#?","No difference","string is an alias for System.String; they are identical","String is faster","string is a value type","A");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'readonly' keyword?","Makes field constant","Field can only be assigned in declaration or constructor","Makes field static","Makes field private","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between == and .Equals() in C#?","No difference","== can be overloaded; .Equals() checks value equality by default","Equals() checks reference","Both check reference","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is a generic class in C#?","A base class","A class parameterized with a type placeholder","An abstract class","An interface","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'params' keyword?","Named arguments","Allow variable number of arguments","Default arguments","Optional arguments","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between List<T> and Array in C#?","No difference","List<T> is dynamic size; Array is fixed size","Array is dynamic","Both are dynamic","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the null-coalescing operator ??","Null check","Returns left operand if not null, otherwise right operand","Null assignment","Null comparison","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of extension methods in C#?","Override methods","Add methods to existing types without modifying them","Create abstract methods","Define interfaces","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between Task and Thread in C#?","No difference","Task is a higher-level abstraction over Thread using thread pool","Thread is higher-level","Both are the same","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'yield return' statement?","Return from method","Lazily produce values in an iterator method","Throw exception","Break loop","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of attributes in C#?","Comments","Metadata attached to code elements","Method modifiers","Type declarations","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between Func<T> and Action<T>?","No difference","Func returns a value; Action returns void","Action returns a value","Both return values","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'partial' keyword in C#?","Split inheritance","Split a class definition across multiple files","Create partial methods","Define partial interfaces","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'checked' keyword?","Null check","Enable overflow checking for arithmetic operations","Type check","Bounds check","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between shallow copy and deep copy in C#?","No difference","Shallow copy copies references; deep copy copies all nested objects","Deep copy copies references","Both copy references","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of IComparable in C#?","Cloning","Define natural ordering for objects","Serialization","Equality comparison","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'lock' statement in C#?","Performance optimization","Ensure only one thread executes a block at a time","Prevent inheritance","Make field readonly","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the difference between Dictionary and Hashtable in C#?","No difference","Dictionary is generic and type-safe; Hashtable is non-generic","Hashtable is generic","Both are generic","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'nameof' operator?","Get type name","Return the name of a variable/member as a string","Get namespace","Get assembly name","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the '?' nullable type modifier?","Optional parameter","Allow value types to hold null","Null check","Conditional access","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'is' keyword in C#?","Assignment","Check if an object is of a specific type","Equality check","Null check","B");
        save(r,"DOTNET",DifficultyLevel.MODERATE,"What is the purpose of the 'as' keyword in C#?","Assignment","Safe cast that returns null instead of throwing on failure","Type check","Null coalescing","B");

        // ADVANCED (33)
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the .NET garbage collector?","Manual memory management","Automatically reclaim memory from unreachable objects","Prevent memory allocation","Manage threads","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the difference between Finalize and Dispose in C#?","No difference","Finalize is called by GC non-deterministically; Dispose is called explicitly","Dispose is called by GC","Both are called by GC","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the IDisposable pattern?","Inheritance","Deterministic release of unmanaged resources","Serialization","Thread safety","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of expression trees in C#?","Lambda compilation","Represent code as data structures that can be analyzed and translated","Event handling","Reflection","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the difference between covariance and contravariance in generics?","No difference","Covariance allows using more derived type; contravariance allows less derived","Contravariance uses more derived","Both are the same","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the Span<T> type in C#?","Generic collection","A stack-allocated view over contiguous memory for zero-allocation slicing","A thread-safe list","A lazy collection","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the Memory<T> type?","Stack memory","A heap-compatible version of Span<T> for async scenarios","A fixed-size array","A thread-local storage","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the ValueTask<T>?","Replace Task","A struct-based task for high-performance scenarios avoiding heap allocation","A cancellable task","A parallel task","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the CancellationToken in async code?","Timeout only","Signal cooperative cancellation of async operations","Thread synchronization","Exception handling","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the difference between ConfigureAwait(false) and default await?","No difference","ConfigureAwait(false) avoids capturing synchronization context for performance","ConfigureAwait(true) avoids context","Both capture context","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the SemaphoreSlim in C#?","Mutex replacement","Limit concurrent access to a resource with async support","Thread pool management","Lock-free synchronization","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the ConcurrentDictionary<K,V>?","Sorted dictionary","Thread-safe dictionary for concurrent read/write operations","Immutable dictionary","Ordered dictionary","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the Lazy<T> class?","Eager initialization","Defer object creation until first access (lazy initialization)","Thread-local storage","Cached computation","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the ThreadLocal<T> class?","Shared state","Provide a separate instance of a value per thread","Thread synchronization","Thread pool management","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the Interlocked class?","Thread creation","Provide atomic operations on shared variables without locks","Mutex management","Thread pool control","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the Channel<T> in .NET?","Event bus","A thread-safe producer-consumer queue for async data pipelines","Message broker","Task scheduler","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of source generators in C#?","Runtime code execution","Generate C# code at compile time based on existing code analysis","Reflection replacement","Dynamic proxy generation","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the record type in C# 9+?","Mutable class","Immutable reference type with value-based equality and auto-generated members","Abstract class","Interface replacement","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of pattern matching in C#?","String matching","Test a value against a pattern and extract data in a concise syntax","Regex matching","Type casting","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the 'init' accessor in C# 9+?","Mutable property","Allow property to be set only during object initialization","Read-only property","Computed property","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the 'with' expression for records?","Mutation","Create a copy of a record with some properties changed (non-destructive mutation)","Cloning","Comparison","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the IAsyncEnumerable<T> interface?","Sync iteration","Enable async streaming of data with await foreach","Parallel iteration","Lazy evaluation","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the Roslyn compiler platform?","Runtime execution","Expose C# and VB compiler as APIs for code analysis and generation","JIT compilation","IL generation","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the difference between .NET Framework and .NET Core/.NET 5+?","No difference",".NET Framework is Windows-only; .NET Core/.NET 5+ is cross-platform","NET Core is Windows-only","Both are cross-platform","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the middleware pipeline in ASP.NET Core?","Database access","Chain of components that handle HTTP requests and responses","Authentication only","Routing only","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of dependency injection in ASP.NET Core?","Database connection","Built-in IoC container for managing object lifetimes and dependencies","Middleware registration","Route configuration","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the difference between Singleton, Scoped, and Transient lifetimes in DI?","No difference","Singleton: one instance; Scoped: per request; Transient: per injection","Transient: one instance","Scoped: per injection","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the IHostedService interface?","HTTP handling","Run background tasks within the ASP.NET Core host lifecycle","Middleware definition","Controller base","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the Entity Framework Core DbContext?","HTTP context","Represents a session with the database for querying and saving data","Dependency injection","Middleware pipeline","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of migrations in Entity Framework Core?","Data seeding","Incrementally update database schema to match model changes","Query optimization","Connection pooling","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the IMemoryCache interface in ASP.NET Core?","Session storage","In-process caching of data to improve performance","Distributed caching","Cookie management","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the MediatR library pattern?","ORM","Implement mediator pattern for decoupled request/response and notifications","Logging","Caching","B");
        save(r,"DOTNET",DifficultyLevel.ADVANCED,"What is the purpose of the FluentValidation library?","ORM mapping","Define validation rules for objects using a fluent API","Dependency injection","Middleware","B");
    }
}
